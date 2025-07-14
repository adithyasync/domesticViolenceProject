let formInput = document.getElementById("user_question")
let age = document.getElementById("age");
function displaySection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('d-none');
    });
    
    // Show the selected section with a fade-in effect
    const selectedSection = document.getElementById(sectionId);
    selectedSection.classList.remove('d-none');
    selectedSection.style.opacity = 0;
    setTimeout(() => {
        selectedSection.style.opacity = 1;
    }, 10);
}

function contactSupport(orgName) {
    alert(`You are now being connected with ${orgName}. Please check your email or phone for further instructions.`);
}

function sendAlert() {
    alert("Panic alert sent to your emergency contacts.");
    // Additional code to send an actual alert can be added here
}

// script.js

// Ensure the document is loaded before attaching events
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('questionForm');
    const responseContainer = document.getElementById('responseContainer');
    const responseElement = document.getElementById('response');

    // Handle form submission asynchronously
    form.addEventListener('submit', function(event) {
        event.preventDefault();  // Prevent form from reloading the page

        const question = document.getElementById('user_question').value;

        // Check if the input is not empty
        if(question.trim() !== "") {
            fetch('/get_response', {
                method: 'POST',
                body: new URLSearchParams({
                    'user_question': formInput.value,
                    'age': age.value,
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            })
            .then(response => response.text())
            .then(data => {
                // Show response on the page
                responseElement.innerHTML = data;
                responseContainer.style.display = "block";
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });
});
