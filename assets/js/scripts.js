document.addEventListener('DOMContentLoaded', function () {
	const searchInput = document.getElementById('searchInput');
	const membershipsContainer = document.getElementById('memberships-container');
	const spinner = document.getElementById('spinner');
	const lazyBackgrounds = document.querySelectorAll('#slider[data-bg]');

	// Lazy load background images
	if ('IntersectionObserver' in window) {
		const lazyBackgroundObserver = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const lazyBackground = entry.target;
					lazyBackground.style.backgroundImage = `url(${lazyBackground.dataset.bg})`;
					lazyBackgroundObserver.unobserve(lazyBackground);
				}
			});
		});

		lazyBackgrounds.forEach(lazyBackground => {
			lazyBackgroundObserver.observe(lazyBackground);
		});
	} else {
		lazyBackgrounds.forEach(lazyBackground => {
			lazyBackground.style.backgroundImage = `url(${lazyBackground.dataset.bg})`;
		});
	}
	

	async function fetchMembers() {
		try {
			const response = await fetch('assets/data/members.json');
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error fetching data:', error);
			return {};
		}
	}

	function renderCardsByLevel(levels) {
		membershipsContainer.innerHTML = '';
		Object.keys(levels).forEach(level => {
			const levelContainer = document.createElement('div');
			levelContainer.className = 'level-container col-12';
			// const levelTitle = document.createElement('h2');
			// levelTitle.className = 'level-title';
			// levelTitle.textContent = level;
			// levelTitle.setAttribute('data-bs-toggle', 'tooltip');
			// levelTitle.setAttribute('title', levels[level]['description']);
			// levelContainer.appendChild(levelTitle);

			const cardsContainer = document.createElement('div');
			cardsContainer.className = 'd-flex flex-wrap justify-content-center row';
			const members = levels[level]["list"];
			members.forEach(leader => {
				const card = document.createElement('div');
				card.className = 'membership-card h-100';

				switch (level) {
					case 'Infinity':
						// card.className = 'membership-card level-infinity';
						break;
					case 'Diamond':
						// card.className = 'membership-card level-diamond';
						break;
					case 'Gold':
						// card.className = 'membership-card level-gold';
						break;
					case 'Silver':
						// card.className = 'membership-card level-silver';
						break;
					default:
						// card.className = 'membership-card level-copper';
						break;

				}

				card.innerHTML = `
                    <img src="${leader.image || 'assets/img/default.png'}" class="card-img-top" alt="${leader.name}" loading="lazy">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${leader.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${leader.role}</h6>
                        <p class="card-text">${leader.experience}</p>
                        <p class="card-text">${leader.bio}</p>
					</div>
					<div class="card-footer d-flex justify-content-start">
						${leader.social.linkedin ? `<a href="${leader.social.linkedin}" class="text-muted" target="_blank">LinkedIn</a>` : ''}
                        ${leader.social.github ? `<a href="${leader.social.github}" class="text-muted ml-2" target="_blank">GitHub</a>` : ''}
                        ${leader.social.facebook ? `<a href="${leader.social.facebook}" class="text-muted ml-2" target="_blank">Facebook</a>` : ''}
                        ${leader.social.website ? `<a href="${leader.social.website}" class="text-muted ml-2" target="_blank">Website</a>` : ''}
					</div>
                    
                `;
				cardsContainer.appendChild(card);
			});

			levelContainer.appendChild(cardsContainer);
			membershipsContainer.appendChild(levelContainer);
		});
	}

	function filterMembersByLevel(levels, searchTerm) {
		const filteredLevels = {};
		Object.keys(levels).forEach(level => {
			const filteredMembers = levels[level]['list'].filter(leader => leader.name.toLowerCase().includes(searchTerm.toLowerCase()));
			if (filteredMembers.length > 0) {
				filteredLevels[level] = { ...levels[level], list: filteredMembers };
			}
		});
		return filteredLevels;
	}

	searchInput.addEventListener('input', async function () {
		spinner.style.display = 'block';
		const data = await fetchMembers();
		spinner.style.display = 'none';
		const searchTerm = searchInput.value.trim();
		const levels = searchTerm ? filterMembersByLevel(data, searchTerm) : data;
		console.log(levels)
		renderCardsByLevel(levels);
	});

	async function loadAllMembers() {
		spinner.style.display = 'block';
		const data = await fetchMembers();
		spinner.style.display = 'none';
		renderCardsByLevel(data);
	}

	loadAllMembers();
});
