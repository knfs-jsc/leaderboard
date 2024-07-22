document.addEventListener('DOMContentLoaded', function () {
	const searchInput = document.getElementById('search-input');
	const leadershipsContainer = document.getElementById('leaderships-container');
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

	async function fetchLeaders() {
		try {
			const response = await fetch('/assets/data/leaders.json'); // Thay đổi đường dẫn nếu cần
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error fetching data:', error);
			return {};
		}
	}

	function renderCardsByLevel(levels) {
		leadershipsContainer.innerHTML = '';
		Object.keys(levels).forEach(level => {
			const levelContainer = document.createElement('div');
			levelContainer.className = 'level-container col-12';
			const levelTitle = document.createElement('h2');
			levelTitle.className = 'level-title';
			levelTitle.textContent = level;
			levelContainer.appendChild(levelTitle);

			const cardsContainer = document.createElement('div');
			cardsContainer.className = 'd-flex flex-wrap justify-content-center';
			const leaders = levels[level]["list"];
			leaders.forEach(leader => {
				const card = document.createElement('div');
				switch (level) {
					case 'Diamond':
						card.className = 'leadership-card level-diamond';
						break;
					case 'Gold':
						card.className = 'leadership-card level-gold';
						break;
					case 'Silver':
						card.className = 'leadership-card level-silver';
						break;
					default:
						card.className = 'leadership-card level-copper';
						break;

				}

				card.innerHTML = `
                    <img src="${leader.image || '/assets/img/default.png'}" class="card-img-top" alt="${leader.name}">
                    <div class="card-body">
                        <h5 class="card-title">${leader.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${leader.role}</h6>
                        <p class="card-text">${leader.bio}</p>
                        <div class="card-links">
                            ${leader.social.linkedin ? `<a href="${leader.social.linkedin}" target="_blank">LinkedIn</a>` : ''}
                            ${leader.social.github ? `<a href="${leader.social.github}" target="_blank">GitHub</a>` : ''}
                            ${leader.social.facebook ? `<a href="${leader.social.facebook}" target="_blank">Facebook</a>` : ''}
                            ${leader.social.website ? `<a href="${leader.social.website}" target="_blank">Website</a>` : ''}
                        </div>
                    </div>
                `;
				cardsContainer.appendChild(card);
			});

			levelContainer.appendChild(cardsContainer);
			leadershipsContainer.appendChild(levelContainer);
		});
	}

	function filterLeadersByLevel(levels, searchTerm) {
		const filteredLevels = {};
		Object.keys(levels).forEach(level => {
			const filteredLeaders = levels[level]['list'].filter(leader => leader.name.toLowerCase().includes(searchTerm.toLowerCase()));
			if (filteredLeaders.length > 0) {
				filteredLevels[level] = { ...levels[level], list: filteredLeaders };
			}
		});
		return filteredLevels;
	}

	searchInput.addEventListener('input', async function () {
		spinner.style.display = 'block';
		const data = await fetchLeaders();
		spinner.style.display = 'none';
		const searchTerm = searchInput.value.trim();
		const levels = searchTerm ? filterLeadersByLevel(data, searchTerm) : data;
		console.log(levels)
		renderCardsByLevel(levels);
	});

	async function loadAllLeaders() {
		spinner.style.display = 'block';
		const data = await fetchLeaders();
		spinner.style.display = 'none';
		renderCardsByLevel(data);
	}

	loadAllLeaders();
});
