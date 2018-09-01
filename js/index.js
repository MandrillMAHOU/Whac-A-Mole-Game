(function(){
	//wolf1: wolf, wolf2: babywolf
	const WOLF1=['./images/h0.png','./images/h1.png','./images/h2.png','./images/h3.png','./images/h4.png','./images/h5.png','./images/h6.png','./images/h7.png','./images/h8.png','./images/h9.png'];
    const WOLF2=['./images/x0.png','./images/x1.png','./images/x2.png','./images/x3.png','./images/x4.png','./images/x5.png','./images/x6.png','./images/x7.png','./images/x8.png','./images/x9.png'];
    const POSITION = [
        {left:"100px",top:"115px"},
        {left:"20px",top:"160px"},
        {left:"190px",top:"142px"},
        {left:"105px",top:"193px"},
        {left:"19px",top:"221px"},
        {left:"202px",top:"212px"},
        {left:"120px",top:"275px"},
        {left:"30px",top:"295px"},
        {left:"209px",top:"297px"}
    ];
    let animationTimer;
    let previousPos = 0;


	$(function(){
		// shows and closes rules
		$(".showRules").on("click", showRules);
		$(".close").on("click", closeRules);
		// start game
		$(".start").on("click", startGame);
		$(".reStart").on("click", startOver);
	});

	function showRules() {
		$(".rule").stop().fadeIn(100);
	}

	function closeRules() {
		$(".rule").stop().fadeOut(100);
	}

	function startGame() {
		$(this).stop().fadeOut(100);
		countDown();
		startAnimation();
	}

	function startOver() {
		$(".mask").stop().fadeOut(100);
		countDown();
		startAnimation();
	}

	function countDown() {
		let $progress = $(".progress");
		$progress.css({width: 180});
		let progressBarTimer = setInterval(function(){
			let newWidth = $progress.width();
			newWidth--;
			$progress.css({width: newWidth});
			if (newWidth <= 0) {
				clearInterval(progressBarTimer);
				gameOver();
			}
		}, 250)
	}

	function gameOver() {
		$(".mask").stop().fadeIn(100);
		// removes all wolves on the screen
		$(".wolf1, .wolf2").remove();
		$(".mask>h1>span").text($(".score").text());
		clearInterval(animationTimer);
	}

	function startAnimation() {
		let $newWolf = generateNewWolf();
		$(".container").append($newWolf);
		animationTimer = setInterval(function(){
			let $newWolf = generateNewWolf();
			$(".container").append($newWolf);
		}, 600);
	}

	function generateNewWolf() {
		let $newImg = $("<img>");
		// random position and wolf type
		let pos = parseInt(Math.random() * 9);
		// make sure there wont two wolves in same cave 
		while (pos == previousPos) {
			pos = parseInt(Math.random() * 9);
		}
		previousPos = pos;
		let wolfSelect = parseInt(Math.random() * 2) == 0 ? WOLF1 : WOLF2;
		$newImg.css("position", "absolute").css(POSITION[pos]).attr({
			class: wolfSelect == WOLF1 ? "wolf1" : "wolf2"
		});
		// there are total 10 frames, if wolf gets hit, imgindex goes to 5, and endframe becomes 9
		// max animation time = 200 * 9 = 1800ms
		// not hit animation time = 1000ms
		let imgIndex = 0;
		let endFrame = 5;
		let imgTimer = setInterval(function(){
			if (imgIndex > endFrame) {
				clearInterval(imgTimer);
				$newImg.remove();
			}
			$newImg.attr({
				src: wolfSelect[imgIndex]
			});
			imgIndex++;
		}, 200);
		$newImg.one("click", function(){
			computeScore($newImg, imgTimer, wolfSelect);
		})
		return $newImg;
	}

	// computes the score and updates the hit animation frames
	function computeScore($wolf, oldTimer, wolfSelect) {
		clearInterval(oldTimer);
		let imgIndex = 6;
		let endFrame = 9;
		let imgTimer = setInterval(function(){
			if (imgIndex > endFrame) {
				clearInterval(imgTimer);
				$wolf.remove();
			}
			$wolf.attr({
				src: wolfSelect[imgIndex]
			});
			imgIndex++;
		}, 200);
		let score = $wolf.attr("class") == "wolf1" ? 10 : -10;
		let curScore = parseInt($(".score").text());
		$(".score").text(curScore + score);
	}
})();
