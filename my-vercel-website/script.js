// Configure API URL using window.location.origin
// During local dev this will be http://localhost:3000
// On production this will be your Vercel URL
const API_URL = `${window.location.origin}/api/data`;

document.addEventListener('DOMContentLoaded', () => {
    // Load existing submissions when page loads
    fetchSubmissions();

    // Handle form submission
    const form = document.getElementById('submission-form');
    form.addEventListener('submit', handleFormSubmit);
});

async function fetchSubmissions() {
    const listContainer = document.getElementById('submissions-list');

    try {
        console.log(`Fetching data from: ${API_URL}`);
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.submissions && data.submissions.length > 0) {
            listContainer.innerHTML = ''; // Clear loading message

            data.submissions.forEach(sub => {
                const date = new Date(sub.created_at).toLocaleString();
                const card = document.createElement('div');
                card.className = 'submission-card';
                card.innerHTML = `
                    <div class="submission-header">
                        <span class="submission-name">${escapeHTML(sub.name)}</span>
                        <span class="submission-date">${date}</span>
                    </div>
                    <div class="submission-message">${escapeHTML(sub.message)}</div>
                `;
                listContainer.appendChild(card);
            });
        } else {
            listContainer.innerHTML = '<p class="loading">No submissions yet. Be the first!</p>';
        }
    } catch (error) {
        console.error('Error fetching submissions:', error);
        listContainer.innerHTML = `<p class="status-message error">Failed to load submissions: ${error.message}</p>`;
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = document.getElementById('submit-btn');
    const statusDiv = document.getElementById('form-status');

    // Get form data
    const formData = {
        name: form.name.value,
        email: form.email.value,
        message: form.message.value
    };

    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    statusDiv.className = 'status-message';

    try {
        console.log(`Sending data to: ${API_URL}`);
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            let errorMsg = `HTTP error! status: ${response.status}`;
            try {
                const result = await response.json();
                errorMsg = result.error || errorMsg;
            } catch (e) { }
            throw new Error(errorMsg);
        }

        // Show success message
        statusDiv.textContent = 'Successfully submitted!';
        statusDiv.className = 'status-message success';

        // Reset form
        form.reset();

        // Refresh submissions list
        fetchSubmissions();

    } catch (error) {
        console.error('Error submitting form:', error);
        statusDiv.textContent = `Error: ${error.message}`;
        statusDiv.className = 'status-message error';
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';

        // Hide status message after 5 seconds
        setTimeout(() => {
            if (statusDiv.className.includes('success')) {
                statusDiv.className = 'status-message';
            }
        }, 5000);
    }
}

// Simple HTML escaper to prevent XSS
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag])
    );
}
