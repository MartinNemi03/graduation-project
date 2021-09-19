<script>
	import momentjs from "moment";
	import "moment/locale/cs";

	let moment, time, date;
	function updateTime() {
		moment = momentjs().locale("cs");
		date = moment.format("dd D.M.");
		time = moment.format('LTS');
	}

	setInterval(updateTime, 500);
	updateTime();

	let currentNews = "c", nextNews = "n", newsIndex = 0;
	let news = [
		`Dneska je ${moment.format("dddd")}.`,
		`Naše škola se účastnila nějaké soutěže.`
	];

	function switchNews() {
		newsIndex++;
		if(newsIndex >= news.length)
			newsIndex = 0;

		nextNews = news[newsIndex];
		document.querySelector('.news').animate([
			{ margin: '16px 0 0 0' },
			{ margin: '-120px 0 0 0' }
		], 1000).play();

		setTimeout(() => {
			currentNews = nextNews;
		}, 900);
	}

	setInterval(switchNews, 5000);
	currentNews = news[newsIndex];
</script>

<overlay id="overlay">
	<div id="overlay-container">
		<div id="timestamp">
			<span class="date">{date}</span><br>
			<span class="time">{time}</span>
		</div>

		<div id="feed">
			<div class="news current">{currentNews}</div>
			<div class="news next">{nextNews}</div>
		</div>
	</div>
</overlay>

<style>
	#overlay {
		position: absolute;
		width: 100%;
		bottom: 0;
	}

	#overlay-container {
		background: linear-gradient(0deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), #FF7D00;
		width: 100%;
		height: 120px;
		text-align: center;
	}

	#timestamp {
		width: 260px;
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
		font-size: 36px;
		font-weight: 400;
		padding-top: 10px;
	}

	.time {
		font-family: 'Poppins', sans-serif;
		font-size: 48px;
		font-weight: 600;
	}

	#feed {
		width: calc(100% - 260px);
		height: 100%;
		font-size: 68px;
		overflow: hidden;
	}

	.news {
		width: 100%;
		height: 100%;
		margin-top: 16px;
		font-size: 56px;
		font-family: 'Poppins', sans-serif;
	}
</style>