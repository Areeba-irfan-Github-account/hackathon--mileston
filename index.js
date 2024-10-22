document.getElementById('addEducation').addEventListener('click', function() {
    const educationEntry = document.querySelector('.education-entry').cloneNode(true);
    document.getElementById('educationEntries').appendChild(educationEntry);
});

document.getElementById('addExperience').addEventListener('click', function() {
    const experienceEntry = document.querySelector('.experience-entry').cloneNode(true);
    document.getElementById('experienceEntries').appendChild(experienceEntry);
});

document.getElementById('skills').addEventListener('input', function() {
    const skillLevels = document.getElementById('skillLevels');
    skillLevels.innerHTML = '';
    const skills = this.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    skills.forEach(skill => {
        const skillDiv = document.createElement('div');
        skillDiv.innerHTML = `
            <label>${skill}</label>
            <input type="range" min="1" max="5" value="3" class="skill-level" data-skill="${skill}">
        `;
        skillLevels.appendChild(skillDiv);
    });
});

document.getElementById('resumeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const previewContent = document.getElementById('previewContent');
    const profilePicture = document.getElementById('profilePicture').files[0];
    const profilePictureSrc = profilePicture ? URL.createObjectURL(profilePicture) : '';
    
    previewContent.innerHTML = `
        <div class="resume-header">
            ${profilePictureSrc ? `<img src="${profilePictureSrc}" alt="Profile Picture" class="profile-picture">` : ''}
            <h1>${document.getElementById('name').value}</h1>
            <p>Email: ${document.getElementById('email').value} | Phone: ${document.getElementById('phone').value}</p>
            <p>Address: ${document.getElementById('address').value}</p>
            ${document.getElementById('linkedin').value ? `<p>LinkedIn: ${document.getElementById('linkedin').value}</p>` : ''}
        </div>
        <h2>About</h2>
        <p>${document.getElementById('about').value}</p>
        <h2>Education</h2>
        ${Array.from(document.querySelectorAll('.education-entry')).map(entry => `
            <div class="education-item">
                <h3>${entry.children[0].value} - ${entry.children[1].value}, ${entry.children[2].value}</h3>
                ${entry.children[3].value ? `<p>${entry.children[3].value}</p>` : ''}
            </div>
        `).join('')}
        <h2>Work Experience</h2>
        ${Array.from(document.querySelectorAll('.experience-entry')).map(entry => `
            <div class="experience-item">
                <h3>${entry.children[0].value} at ${entry.children[1].value}</h3>
                <p>${entry.children[2].value}</p>
                <p>${entry.children[3].value}</p>
                ${entry.children[4].value ? `<p><strong>Key Achievements:</strong> ${entry.children[4].value}</p>` : ''}
            </div>
        `).join('')}
        <h2>Skills</h2>
        <ul>
        ${Array.from(document.querySelectorAll('.skill-level')).map(skill => `
            <li>${skill.dataset.skill}: ${'★'.repeat(skill.value)}${'☆'.repeat(5 - skill.value)}</li>
        `).join('')}
        </ul>
    `;
    document.getElementById('resumePreview').classList.remove('hidden');
});

document.getElementById('printResume').addEventListener('click', function() {
    window.print();
});

document.getElementById('submitResume').addEventListener('click', function() {
    // Here you would typically send the data to a server
    alert('Resume submitted successfully!');
    resetForm();
});

document.getElementById('cancelResume').addEventListener('click', function() {
    resetForm();
});

function resetForm() {
    document.getElementById('resumeForm').reset();
    document.getElementById('resumePreview').classList.add('hidden');
    document.getElementById('skillLevels').innerHTML = '';
}

document.getElementById('shareResume').addEventListener('click', function() {
    // Create a shareable link
    const shareableLink = generateShareableLink();

    // Copy the link to clipboard
    navigator.clipboard.writeText(shareableLink).then(function() {
        alert('Shareable link copied to clipboard: ' + shareableLink);
    }, function(err) {
        console.error('Could not copy text: ', err);
        alert('Failed to copy link. Shareable link: ' + shareableLink);
    });
});

function generateShareableLink() {
    const shareableData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        linkedin: document.getElementById('linkedin').value,
        about: document.getElementById('about').value,
        education: Array.from(document.querySelectorAll('.education-entry')).map(entry => ({
            degree: entry.children[0].value,
            institution: entry.children[1].value,
            year: entry.children[2].value,
            achievements: entry.children[3].value
        })),
        experience: Array.from(document.querySelectorAll('.experience-entry')).map(entry => ({
            title: entry.children[0].value,
            company: entry.children[1].value,
            duration: entry.children[2].value,
            description: entry.children[3].value,
            achievements: entry.children[4].value
        })),
        skills: Array.from(document.querySelectorAll('.skill-level')).map(skill => ({
            name: skill.dataset.skill,
            level: skill.value
        }))
    };

    const userName = shareableData.name.toLowerCase().replace(/\s+/g, '');
    localStorage.setItem(userName, JSON.stringify(shareableData));

    const uniqueUrl = `resume-viewer.html?u=${userName}`;
    return uniqueUrl;
}

function shareResume() {
    const shareableLink = generateShareableLink();
    const resultDiv = document.createElement('div');
    resultDiv.className = 'share-result';
    resultDiv.innerHTML = `
        <p>Your resume link:</p>
        <a href="${shareableLink}" class="share-link">${shareableLink}</a>
        <button class="copy-btn">Copy Link</button>
    `;
    document.body.appendChild(resultDiv);

    const copyBtn = resultDiv.querySelector('.copy-btn');
    copyBtn.addEventListener('click', function () {
        navigator.clipboard.writeText(shareableLink).then(function() {
            alert('Link copied to clipboard!');
        }, function(err) {
            console.error('Could not copy text: ', err);
            alert('Failed to copy link. Please copy it manually.');
        });
    });

  
    document.head.appendChild(style);
}

function loadSharedResume() {
    const urlParams = new URLSearchParams(window.location.search);
    const userName = urlParams.get('u');

    if (userName) {
        try {
            const sharedResumeData = JSON.parse(localStorage.getItem(userName));
            
            if (!sharedResumeData) {
                throw new Error('No data found for this username');
            }

            document.getElementById('name').value = sharedResumeData.name;
            document.getElementById('email').value = sharedResumeData.email;
            document.getElementById('phone').value = sharedResumeData.phone;
            document.getElementById('address').value = sharedResumeData.address;
            document.getElementById('linkedin').value = sharedResumeData.linkedin;
            document.getElementById('about').value = sharedResumeData.about;

            const educationEntries = document.getElementById('educationEntries');
            educationEntries.innerHTML = '';
            sharedResumeData.education.forEach(edu => {
                const entry = document.createElement('div');
                entry.className = 'education-entry';
                entry.innerHTML = `
                    <input type="text" value="${edu.degree}" placeholder="Degree" required>
                    <input type="text" value="${edu.institution}" placeholder="Institution" required>
                    <input type="text" value="${edu.year}" placeholder="Graduation Year" required>
                    <textarea placeholder="Achievements or Relevant Coursework">${edu.achievements}</textarea>
                `;
                educationEntries.appendChild(entry);
            });

            const experienceEntries = document.getElementById('experienceEntries');
            experienceEntries.innerHTML = '';
            sharedResumeData.experience.forEach(exp => {
                const entry = document.createElement('div');
                entry.className = 'experience-entry';
                entry.innerHTML = `
                    <input type="text" value="${exp.title}" placeholder="Job Title" required>
                    <input type="text" value="${exp.company}" placeholder="Company" required>
                    <input type="text" value="${exp.duration}" placeholder="Duration" required>
                    <textarea placeholder="Job Description" required>${exp.description}</textarea>
                    <textarea placeholder="Key Achievements">${exp.achievements}</textarea>
                `;
                experienceEntries.appendChild(entry);
            });

            const skillsInput = document.getElementById('skills');
            skillsInput.value = sharedResumeData.skills.map(skill => skill.name).join(', ');
            skillsInput.dispatchEvent(new Event('input'));

            sharedResumeData.skills.forEach(skill => {
                const skillInput = document.querySelector(`.skill-level[data-skill="${skill.name}"]`);
                if (skillInput) {
                    skillInput.value = skill.level;
                }
            });

            document.getElementById('generateResume').click();
        } catch (error) {
            console.error('Error loading shared resume:', error);
            alert('Failed to load shared resume. The link may be invalid or the data is not available.');
        }
    }
}

window.addEventListener('load', loadSharedResume);
document.getElementById('shareResume').addEventListener('click', shareResume);