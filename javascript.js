(function() {

	// Your web app's Firebase configuration
	var firebaseConfig = {
		apiKey: "AIzaSyCKQ8KFFxaEibxwASx2015Embw7_WvsQ2U",
		authDomain: "questions-ocr.firebaseapp.com",
		databaseURL: "https://questions-ocr.firebaseio.com",
		projectId: "questions-ocr",
		storageBucket: "questions-ocr.appspot.com",
		messagingSenderId: "810522794089",
		appId: "1:810522794089:web:571e25abc81c241a792af8",   
		measurementId: "G-3TX0JHW81V"
	};
	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);
	var a = "cd";
	var obj;
	var objo;
	var topics = [];
	var topic = "Cengage Straight Lines";
	var ref = firebase.database().ref();
	ref.once("value",function(snapshot){
	ob = JSON.parse(JSON.stringify(snapshot.val()));
	for (var key in ob) {
		topics.push(key);
	}
	/*var list = document.getElementById("topics_list");
	list.innerHTML = "";*/
	var list2 = document.getElementById("section_names");
	list2.innerHTML = "";
	for(topi in topics){
		/*var node = document.createElement("option");  
		node.setAttribute("value",topics[topi]); 
		node.text = topics[topi];
		list.appendChild(node);*/
		var node2 = document.createElement("div");  
		node2.innerHTML = topics[topi];
		node2.classList.add("section_unselected");
		list2.appendChild(node2);
	} // key1 and etc...
	/*list.addEventListener("change",function(){
		loadTopic(this.value);

	});*/

  var children = list2.childNodes;
	for(var i = 0; i<children.length; i++){
		children[i].addEventListener("click", function(){
			loadTopic(this.innerHTML);
		})
	}


});
	async function loadTopic(top){
		console.log("started");
		var ref = firebase.database().ref();
		var ref3 = ref.child(top);
		ref3.once("value", function(snapshot){
			obj = JSON.parse(JSON.stringify(snapshot.val()));
			start(obj,top);
		});
	}

	function start(obj1,top1){

		var palette = document.getElementById("palette-list");
		palette.innerHTML = "";
		const output = [];

		var index = [];

		for (var x in obj1) {
	 		index.push(x);
		}

		var keyys = Object.keys(obj1);
		console.log("yes "+keyys[0]);

		const previousButton1 = document.getElementById("pre");
		const chooseText = document.getElementById("choose_text");

		if(document.getElementById("f_choice").checked === true){
			previousButton1.style.opacity = "1";
			chooseText.innerHTML = "Choose a Question (Do not click on numbers below for navigation, use next and previous)";
			palette.classList.add("non_clickable");
		}else if (document.getElementById("f_choice").checked === false){
			previousButton1.style.opacity = "0";
			palette.classList.remove("non_clickable");
		}

		for(var i =0;i<index.length-1;i++){
			const answers = [];

			//var qname2 = "Q" + i.toString();
			var qname = (i+1);

			if(document.getElementById("f_choice").checked === true){
				if (obj1[qname].f === true) {
					answers.push(
						`<label>
						<input type="radio" name="${qname}" value="A">
						${obj1[qname].o1}
						</label>`
						);
					answers.push(
						`<label>
						<input type="radio" name="${qname}" value="B">
						${obj1[qname].o2}
						</label>`
						);
					answers.push(
						`<label>
						<input type="radio" name="${qname}" value="C">
						${obj1[qname].o3}
						</label>`
						);
					answers.push(
						`<label>
						<input type="radio" name="${qname}" value="D">
						${obj1[qname].o4}
						</label>`
						);
					// add this question and its answers to the output
					var x = output.push(
						`<div class="slide">
						<div class="question"> ${obj1[qname].q} </div>
						<div class="answers"> ${answers.join("")} </div>
						<div class="question" style="font-size: 15px">Correct Ans: ${obj1[qname].ans} </div>
						</div>`
						);

					var node = document.createElement("div");  
					node.classList.add("nv");
					node.classList.add("item");
					node.innerHTML = (i+1).toString();
					palette.appendChild(node);
				}
			}else{

				answers.push(
					`<label>
					<input type="radio" name="${qname}" value="A">
					${obj1[qname].o1}
					</label>`
					);
				answers.push(
					`<label>
					<input type="radio" name="${qname}" value="B">
					${obj1[qname].o2}
					</label>`
					);
				answers.push(
					`<label>
					<input type="radio" name="${qname}" value="C">
					${obj1[qname].o3}
					</label>`
					);
				answers.push(
					`<label>
					<input type="radio" name="${qname}" value="D">
					${obj1[qname].o4}
					</label>`
					);
				// add this question and its answers to the output
				var x = output.push(
					`<div class="slide">
					<div class="question"> ${obj1[qname].q} </div>
					<div class="answers"> ${answers.join("")} </div>
					</div>`
					);

				var node = document.createElement("div");  
				node.classList.add("nv");
				node.classList.add("item");
				node.innerHTML = (i+1).toString();
				palette.appendChild(node);  
			}
		}

		const quizContainer = document.getElementById("quiz");

		quizContainer.innerHTML = output.join("");

		MathJax.typeset();


		function showResults() {
			// gather answer containers from our quiz

			const answerContainers = quizContainer.querySelectorAll(".answers");

			// keep track of user's answers
			let numCorrect = 0;

			var index = [];

			for (var x in obj1) {
				index.push(x);
			}

			// for each question...
			for(var i =1;i<=Object.keys(obj1).length-1;i++){

				var qname = index[i];

				// find selected answer
				const answerContainer = answerContainers[i-1];
				const selector = `input:checked`;
				const userAnswer = (answerContainer.querySelector(selector) || {}).value;

				// if answer is correct
				if (userAnswer == obj1[qname].ans) {
					// add to the number of correct answers
					numCorrect++;

					// color the answers green
					answerContainers[i-1].style.color = "lightgreen";
				} else {
					// if answer is wrong or blank
					// color the answers red
					var cv = document.createElement("div");
					cv.classList.add(".question");
					cv.innerHTML = `Correct Answer: ${obj1[qname].ans}`;
					answerContainers[i-1].appendChild(cv);
					answerContainers[i-1].style.color = "red";

				}
			}

			// show number of correct answers out of total
			var ef = `${numCorrect} out of ${Object.keys(obj1).length} correct`;
			alert(ef);
		}

		function showSlide(n,value) {

			var qname = (currentSlide+1).toString();
			const answerContainer = document.querySelectorAll(".answers")[currentSlide];
			const selector = `input:checked`;
			
				var answerInput = answerContainer.querySelector(selector);

				var dc = palette.childNodes;

				if((answerInput != null)&&(!dc[currentSlide].classList.contains("amr"))&&(!dc[currentSlide].classList.contains("mr"))){
					dc[currentSlide].classList.remove("nv","na");
					dc[currentSlide].classList.add("a");
				}
				if((answerInput != null)&&(dc[currentSlide].classList.contains("mr"))){
					dc[currentSlide].classList.remove("mr");
					dc[currentSlide].classList.add("amr");
				}

				if((answerInput != null)&&(value == true)){
					dc[currentSlide].classList.remove("mr","amr","na");
					dc[currentSlide].classList.add("a");
				}

				if(n != index.length-1){
					slides[currentSlide].classList.remove("active-slide");
					slides[n].classList.add("active-slide");

					currentSlide = n;
					qname = (currentSlide+1).toString();

					var ref8 = firebase.database().ref();
					var ref9 = ref8.child(top1);
					ref9.once("value", function(snapshot3){
					obj3 = JSON.parse(JSON.stringify(snapshot3.val()));

          if(obj3[qname].f == false || obj3[qname].f == undefined){
						saveButton.innerHTML = "Save";
				    saveButton.style.backgroundColor = "#fff";
				    saveButton.style.color = "#000";
				  }else if(obj3[qname].f == true){
            saveButton.innerHTML = "Saved";
			      saveButton.style.backgroundColor = "#279";
			      saveButton.style.color = "#FFF";
				  }

				  });

			    var qnoContainer = document.getElementById("question-title");
					var dc = palette.childNodes;
		      if(dc[currentSlide].classList.contains("nv")){
			      var dc = palette.childNodes;
						dc[currentSlide].classList.remove("nv");
						dc[currentSlide].classList.add("na"); 
						qnoContainer.innerHTML = "Question no. " + (currentSlide+1);
					}
				}


		}

		function showNextSlide() {
			showSlide(currentSlide + 1, true);
		}

		function clearResponse(){
			const answerContainer = quizContainer.querySelectorAll(".answers");
			var cc = answerContainer[0].querySelectorAll("input");
			for (var i = 0; i < cc.length; i++) {
				cc[i].checked = false;
			}
		}

		function markAndNextSlide(){
			var dc = palette.childNodes;
			dc[currentSlide].classList.remove("nv","na","a");
			dc[currentSlide].classList.add("mr");
			showSlide(currentSlide + 1, false);
		}

		async function saveQuestion(){
			if(saveButton.innerHTML == "Save"){
				var q = firebase.database().ref().child(top1).child((currentSlide+1).toString());
	      q.update( {"f":true} );
	      saveButton.innerHTML = "Saved";
	      saveButton.style.backgroundColor = "#279";
	      saveButton.style.color = "#FFF";
      }else if(saveButton.innerHTML == "Saved"){
      	var q = firebase.database().ref().child(top1).child((currentSlide+1).toString());
	      q.update( {"f":false} );
	      saveButton.innerHTML = "Save";
	      saveButton.style.backgroundColor = "#fff";
	      saveButton.style.color = "#000";
      }
		}

		function showPreviousSlide(){
			showSlide(currentSlide - 1, false);
		}

		const quizContainer1 = document.getElementById("quiz");
		var resultsContainer = document.getElementById("results");
		const submitButton = document.getElementById("submit");
		const saveButton = document.getElementById("favourite");
		const previousButton = document.getElementById("pre");

		// display quiz right away
		//buildQuiz();

		const nextButton = document.getElementById("next");
		const markButton = document.getElementById("mfran");
		const clearButton = document.getElementById("cr");
		const slides = document.querySelectorAll(".slide");

		let currentSlide = 0;
		showSlide(currentSlide, false);

		// on submit, show results
		submitButton.addEventListener("click", showResults);

		nextButton.addEventListener("click", showNextSlide);

		clearButton.addEventListener("click", clearResponse);

		markButton.addEventListener("click", markAndNextSlide);

		saveButton.addEventListener("click", saveQuestion);

		previousButton.addEventListener("click", showPreviousSlide);

		const pContainers = document.querySelectorAll(".item");
		for(var i = 0; i<pContainers.length;i++){
			pContainers[i].addEventListener("click",function(){
				showSlide(parseInt(this.textContent,10)-1, false);
			});
		}

		document.getElementById("reload").addEventListener("click",function(){
			loadTopic(top1);
		});

	}

})();