import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request for preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Handle GET request to fetch all data
        if (req.method === 'GET') {
            try {
                // Return recent submissions, limit to 50
                const { rows } = await sql`SELECT * FROM submissions ORDER BY created_at DESC LIMIT 50;`;
                return res.status(200).json({ submissions: rows });
            } catch (dbError) {
                // Provide a soft error if the table hasn't been set up yet
                if (dbError.message.includes('relation "submissions" does not exist')) {
                    return res.status(200).json({
                        submissions: [],
                        message: "Table doesn't exist yet. Please create it in Vercel Storage."
                    });
                }
                throw dbError;
            }
        }

        // Handle POST request to insert new data
        if (req.method === 'POST') {
            const { name, email, message } = req.body;

            // Validate input
            if (!name || !email || !message) {
                return res.status(400).json({ error: 'Name, email, and message are required' });
            }

            // Execute parameterized insert query
            const result = await sql`
                INSERT INTO submissions (name, email, message)
                VALUES (${name}, ${email}, ${message})
                RETURNING id, name, created_at;
            `;

            return res.status(201).json({
                success: true,
                submission: result.rows[0]
            });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}
