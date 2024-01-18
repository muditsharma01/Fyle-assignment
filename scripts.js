// Event listener for form submission
document.getElementById('user-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Fetching input values
    const username = document.getElementById('username').value;
    const perPage = document.getElementById('repos-per-page').value;
    const reposContainer = document.getElementById('repos-container');

    // Fetch user and repositories information using the Github API
    const [userResponse, reposResponse] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`),
        fetch(`https://api.github.com/users/${username}/repos?per_page=${perPage}`)
    ]);

    // Parsing API responses
    const userData = await userResponse.json();
    const reposData = await reposResponse.json();

    // Render user details and repositories
    displayUserDetails(userData);
    renderRepositories(reposData, reposContainer);
});

// Function to display user details
function displayUserDetails(user) {
    const userContainer = document.getElementById('user-details');
    const userProfileLink = `https://github.com/${user.login}`;
    const locationIcon = 'https://png.pngtree.com/png-vector/20190215/ourmid/pngtree-vector-location-icon-png-image_515424.jpg';

    // Populating user details in the HTML
    userContainer.innerHTML = `
        <img src="${user.avatar_url}" alt="${user.login} avatar" class="img-fluid rounded-circle mb-3" style="max-width: 100px;">
        <h2>${user.name || user.login}</h2>
        <p>Public Repositories: ${user.public_repos || 0}</p>
        <p>Email: ${user.email || 'Not available'}</p>
        <p>
            <img src="${locationIcon}" alt="Location Icon" style="width: 20px; height: 20px; margin-right: 5px;">
            Location: ${user.location || 'Not specified'}
        </p>
        <p>Bio: ${user.bio || 'No bio available.'}</p>
        <p>
            <a href="${userProfileLink}" target="_blank" title="View GitHub Profile" class="text-dark">
                <img src="https://png.pngtree.com/element_our/20190529/ourmid/pngtree-link-icon-image_1197618.jpg" alt="GitHub Profile" style="width: 20px; height: 20px; margin-right: 5px;">
                ${userProfileLink}
            </a>
        </p>
    `;
}

// Function to render repositories
function renderRepositories(reposData, container) {
    // Render repositories in two columns using Bootstrap grid
    let reposHTML = '';
    reposData.forEach((repo) => {
        reposHTML += `
            <div class="col-md-6">
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">${repo.name}</h5>
                        <p class="card-text">${repo.description || 'No description available.'}</p>
                        ${renderLanguages(repo.languages)}
                        <a href="${repo.html_url}" class="btn btn-primary mt-3" target="_blank">View Repository</a>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = reposHTML;
}

// Function to render programming languages as badges
function renderLanguages(languages) {
    if (!languages) return '';

    const languageItems = Object.keys(languages).map(language => {
        return `<span class="badge badge-primary">${language}</span>`;
    });

    return `<div class="mb-2">${languageItems.join(' ')}</div>`;
}
