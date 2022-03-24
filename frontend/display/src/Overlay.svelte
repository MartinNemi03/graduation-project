<script>
	const weekdays = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];
	let time = "00:00:00", date = "Ne 1.1.";

	function updateTime() {
		let d = new Date();

		let hours = d.getHours();
		let mins = d.getMinutes();
		let secs = d.getSeconds();
		
		date = `${weekdays[d.getDay()].slice(0, 2)} ${d.getDate()}.${d.getMonth() + 1}.`;
		time = `${hours < 10 ? '0' + hours : hours}:${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
	}

	setInterval(updateTime, 100);

	let currentNews, nextNews, newsIndex = 0;
	export let news = [];

	const switchNews = () => {
		if (news.length <= 0) return;

		newsIndex++;
		if(newsIndex >= news.length)
			newsIndex = 0;

		nextNews = news[newsIndex];
		if (currentNews === nextNews) return;

		let elem = document.querySelector('.current');
		elem.animate([
			{ margin: `${getComputedStyle(elem).marginTop} 0 0 0` },
			{ margin: `-${getComputedStyle(document.documentElement).getPropertyValue('--overlay-height')} 0 0 0` }
		], 1000).play();

		setTimeout(() => {
			currentNews = nextNews;
		}, 900);
	};

	setInterval(switchNews, 7500);
	if (news.length >= newsIndex)
		currentNews = news[newsIndex];
</script>

<overlay id="overlay">
	<div id="overlay-container">
		<div id="timestamp">
			<span class="date">{date}</span><br>
			<span class="time">{time}</span>
		</div>

		<div id="feed">
			<div class="news current">
				{#if currentNews != null}
					{currentNews}
				{/if}
			</div>
			<div class="news next">
				{#if nextNews != null}
					{nextNews}
				{/if}
			</div>
		</div>
	</div>
</overlay>

<style>
	:global(:root) {
		--overlay-height: 120px; 
		--news-font-size: 56px;

		--timestamp-width: 260px;
		--date-font-size: 36px;
		--time-font-size: 48px;
	}
	#overlay {
		position: absolute;
		width: 100%;
		bottom: 0;
		z-index: 10;
	}

	#overlay-container {
		background: linear-gradient(0deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), #FF7D00;
		width: 100%;
		height: var(--overlay-height);
		text-align: center;
	}

	#timestamp {
		width: var(--timestamp-width);
		height: calc(100% - 10px);
		padding-top: 10px;
		line-height: 44px;
		text-transform: capitalize;
		background-color: #FF7D00;
		color: white;
		float: left;
	}

	.date {
		font-family: 'Poppins', sans-serif;
		font-size: var(--date-font-size);
		font-weight: 400;
		padding-top: calc(var(--overlay-height) / 12);
	}

	.time {
		font-family: 'Poppins', sans-serif;
		font-size: var(--time-font-size);
		font-weight: 600;
	}

	#feed {
		width: calc(100% - var(--timestamp-width));
		height: 100%;
		overflow: hidden;
	}

	.news {
		width: 100%;
		height: 100%;
		margin-top: calc((var(--overlay-height) - var(--news-font-size)) / 3);
		font-size: var(--news-font-size);
		font-family: 'Poppins', sans-serif;
	}

	@media (max-width: 1360px) {
		:global(:root) {
			--overlay-height: 80px;
			--news-font-size: 40px;

			--timestamp-width: 185px;
			--date-font-size: 26px;
			--time-font-size: 36px;
		}

		#timestamp {
			height: calc(100% - 5px);
			padding-top: 5px;
			line-height: 34px;
		}
	}
</style>