document.addEventListener("mousemove", (e) => {
  const cursor = document.querySelector(".cursor")
  cursor.style.left = e.clientX + "px"
  cursor.style.top = e.clientY + "px"
})

function typeWriter(element, text, speed = 100) {
  let i = 0
  element.innerHTML = ""

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i)
      i++
      setTimeout(type, speed)
    }
  }
  type()
}

document.addEventListener("DOMContentLoaded", () => {
  const titleElement = document.querySelector(".typewriter")
  const text = titleElement.getAttribute("data-text")
  typeWriter(titleElement, text, 150)

  loadDailyMessage()
  generateConstellation()
  startCountdown()

  if (localStorage.getItem("notebookUnlocked") === "true") {
    unlockNotebook()
  }

  initLiveStats()
  renderPlaylist()

  document.getElementById("revealTimelineBtn").addEventListener("click", revealTimeline)
  document.getElementById("startGameBtn").addEventListener("click", startGame)
  document.getElementById("resetGameBtn").addEventListener("click", resetGame)
  document.getElementById("startTriviaBtn").addEventListener("click", startTriviaGame)
  document.getElementById("nextQuestionBtn").addEventListener("click", displayNextQuestion)
  document.getElementById("resetTriviaBtn").addEventListener("click", resetTriviaGame)
})

async function loadDailyMessage() {
  try {
    const response = await fetch("messages.json")
    const data = await response.json()

    const today = new Date()
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)
    const messageIndex = dayOfYear % data.messages.length

    const messageElement = document.querySelector(".typewriter-message")
    const dateElement = document.getElementById("messageDate")

    typeWriter(messageElement, data.messages[messageIndex], 50)
    dateElement.textContent = today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (error) {
    console.error("error loading daily message:", error)
    document.querySelector(".typewriter-message").textContent = "you make every day brighter! ✨"
  }
}

function checkSecretCode() {
  const code = document.getElementById("secretCode").value.toLowerCase()
  const secretMessage = document.getElementById("secretMessage")

  if (code === "monki" || code === "monkey") {
    secretMessage.textContent = "you found the secret! you're my favorite monki 🐒💕"
    createSparkles(document.querySelector(".secret-card"))
  } else {
    secretMessage.textContent = "wrong code! try again 💕"
  }
}

function createSparkles(element) {
  for (let i = 0; i < 10; i++) {
    const sparkle = document.createElement("div")
    sparkle.innerHTML = "✨"
    sparkle.style.position = "absolute"
    sparkle.style.left = Math.random() * 100 + "%"
    sparkle.style.top = Math.random() * 100 + "%"
    sparkle.style.animation = "sparkle 1s ease-out forwards"
    sparkle.style.pointerEvents = "none"
    element.style.position = "relative"
    element.appendChild(sparkle)

    setTimeout(() => sparkle.remove(), 1000)
  }
}

const sparkleCSS = `
@keyframes sparkle {
    0% { opacity: 0; transform: scale(0) rotate(0deg); }
    50% { opacity: 1; transform: scale(1) rotate(180deg); }
    100% { opacity: 0; transform: scale(0) rotate(360deg); }
}
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
`

const style = document.createElement("style")
style.textContent = sparkleCSS
document.head.appendChild(style)

async function generateConstellation() {
  try {
    const response = await fetch("memories.json")
    const data = await response.json()
    const container = document.getElementById("constellationContainer")

    data.memories.forEach((memory) => {
      const star = document.createElement("div")
      star.className = "star"

      star.style.left = memory.x || Math.random() * 95 + "%"
      star.style.top = memory.y || Math.random() * 95 + "%"
      star.style.animationDelay = Math.random() * 2 + "s"

      star.addEventListener("click", () => {
        showMemory(memory.text)
      })

      container.appendChild(star)
    })
  } catch (error) {
    console.error("error loading memories:", error)
  }
}

function showMemory(memory) {
  const display = document.getElementById("memoryDisplay")
  display.innerHTML = `<div style="animation: fadeIn 0.5s ease-in;">${memory}</div>`
}

function startCountdown() {
  const targetDate = new Date("2025-09-22T00:00:00").getTime()

  function updateCountdown() {
    const now = new Date().getTime()
    const distance = targetDate - now

    if (distance < 0) {
      document.getElementById("countdownDisplay").innerHTML =
        '<div style="text-align: center; font-size: 1.5rem; color: #ffd700;">RAAAHHHH WE ARE SO BACK</div>'
      return
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((distance % (1000 * 60)) / 1000)

    document.getElementById("days").textContent = days.toString().padStart(2, "0")
    document.getElementById("hours").textContent = hours.toString().padStart(2, "0")
    document.getElementById("minutes").textContent = minutes.toString().padStart(2, "0")
    document.getElementById("seconds").textContent = seconds.toString().padStart(2, "0")
  }

  updateCountdown()
  setInterval(updateCountdown, 1000)
}

// notebook functionality
function unlockNotebook() {
  const password = document.getElementById("notebookPassword").value
  const correctPassword = "SPONGEBOB"

  if (password === correctPassword || localStorage.getItem("notebookUnlocked") === "true") {
    document.getElementById("notebookLock").style.display = "none"
    document.getElementById("notebook").style.display = "block"
    localStorage.setItem("notebookUnlocked", "true")
  } else {
    alert("incorrect password! try again")
  }
}

function lockNotebook() {
  document.getElementById("notebookLock").style.display = "block"
  document.getElementById("notebook").style.display = "none"
  localStorage.removeItem("notebookUnlocked")
  document.getElementById("notebookPassword").value = ""
}

document.getElementById("notebookPassword").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    unlockNotebook()
  }
})

// playlist functionality
const playlistSongs = [
  { name: "alife", link: "https://www.youtube.com/watch?v=MhQht-YK8rw" },
  { name: "on an island (this one makes me think of our first kiss :))", link: "https://www.youtube.com/watch?v=zgtoe1CvlHE" },
  { name: "40 days", link: "https://www.youtube.com/watch?v=QKOF7NaWv1A" },
  { name: "between the bars", link: "https://www.youtube.com/watch?v=n5g-91mwiNs" },
  { name: "kisses", link: "https://www.youtube.com/watch?v=97U7erexyR0" },
  {
    name: "echoes (ts is 20 mins and has whale noises but YOU GOTTA VIBE WITH IT)",
    link: "https://www.youtube.com/watch?v=53N99Nim6WE&list=RD53N99Nim6WE&start_radio=1",
  },
  {
    name: "very secret song you 100% gotta listen to it's very important to me",
    link: "https://www.youtube.com/watch?v=O91DT1pR1ew",
  },
]

function renderPlaylist() {
  const playlistList = document.getElementById("playlistList")
  playlistList.innerHTML = ""

  playlistSongs.forEach((song) => {
    const songDiv = document.createElement("div")
    songDiv.className = "playlist-item"

    const songNameSpan = document.createElement("span")
    songNameSpan.className = "playlist-item-name"
    songNameSpan.textContent = song.name
    // Add event listener to the song name span
    songNameSpan.addEventListener("click", () => {
      window.open(song.link, "_blank")
    })
    songDiv.appendChild(songNameSpan)

    const playButton = document.createElement("button")
    playButton.className = "playlist-play-btn"
    playButton.innerHTML = "▶"
    playButton.addEventListener("click", () => {
      window.open(song.link, "_blank")
    })
    songDiv.appendChild(playButton)

    playlistList.appendChild(songDiv)
  })
}

// live stats functionality with fallback
async function initLiveStats() {
  const statsContent = document.getElementById("statsContent")

  try {
    // try espn api first
    const response = await fetch("https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/lal")

    if (!response.ok) {
      throw new Error("espn api failed")
    }

    const data = await response.json()
    const team = data.team

    statsContent.innerHTML = `
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-label">team</div>
          <div class="stat-value">${team.displayName}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">record</div>
          <div class="stat-value">${team.record?.items?.[0]?.summary || "n/a"}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">conference</div>
          <div class="stat-value">${team.standingSummary || "western"}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">next game</div>
          <div class="stat-value">check espn.com</div>
        </div>
      </div>
    `
  } catch (error) {
    console.log("live stats failed, removing section:", error)
    const statsCard = document.getElementById("statsCard")
    if (statsCard) {
      statsCard.remove()
    }
  }
}

const timelineMilestones = [
  { date: "mar 23 2024", text: "the day we met" },
  { date: "mar 24 2024", text: "our first official date" },
  { date: "apr 01 2024", text: "you said 'i love you' for the first time" },
  { date: "apr 02 2024", text: "the day we started dating" },
  { date: "jun 12 2024", text: "first time we had to do long distance :(" },
  { date: "sep 28 2024", text: "my birthday!" },
  { date: "nov 02 2024", text: "your birthday!" },
  { date: "jan 11 2025", text: "🤭" },
  { date: "feb 14 2025", text: "our first valentine's day, but it was in winter break :(" },
  { date: "mar 21 2025", text: "first time i came over to ur place" },
  { date: "apr 02 2025", text: "one year together! you made me upset that day also MONKEY" },
]

function revealTimeline() {
  const timelineContainer = document.getElementById("timelineContainer")
  const revealBtn = document.getElementById("revealTimelineBtn")

  if (timelineContainer.classList.contains("visible")) {
    timelineContainer.classList.remove("visible")
    timelineContainer.innerHTML = ""
    revealBtn.textContent = "reveal our milestones"
  } else {
    timelineContainer.classList.add("visible")
    timelineContainer.innerHTML = ""
    timelineMilestones.forEach((milestone) => {
      const item = document.createElement("div")
      item.className = "timeline-item-horizontal"
      item.innerHTML = `
        <div class="timeline-date">${milestone.date}</div>
        <div class="timeline-text">${milestone.text}</div>
      `
      timelineContainer.appendChild(item)
    })
    revealBtn.textContent = "hide our milestones"
  }
}

let gameScore = 0
let gameTimeLeft = 0
let gameInterval
let lebronSpawnInterval
let gameRunning = false

const GAME_DURATION = 30
const LEBRON_SPAWN_RATE = 800
const LEBRON_LIFESPAN = 1500

function startGame() {
  if (gameRunning) return

  gameRunning = true
  gameScore = 0
  gameTimeLeft = GAME_DURATION
  document.getElementById("gameArea").innerHTML = ""
  document.getElementById("gameMessage").textContent = ""
  document.getElementById("startGameBtn").style.display = "none"
  document.getElementById("resetGameBtn").style.display = "none"

  updateGameDisplay()

  gameInterval = setInterval(updateGameTimer, 1000)
  lebronSpawnInterval = setInterval(spawnLeBron, LEBRON_SPAWN_RATE)
}

function updateGameTimer() {
  gameTimeLeft--
  updateGameDisplay()

  if (gameTimeLeft <= 0) {
    endGame()
  }
}

function spawnLeBron() {
  if (!gameRunning) return

  const lebron = document.createElement("img")
  lebron.className = "lebron-target"
  lebron.src = "images/sunshine_lebron.PNG"
  lebron.alt = "lebron"

  const gameArea = document.getElementById("gameArea")
  const areaWidth = gameArea.clientWidth - 50
  const areaHeight = gameArea.clientHeight - 50
  lebron.style.left = Math.random() * areaWidth + "px"
  lebron.style.top = Math.random() * areaHeight + "px"

  lebron.addEventListener("click", clickLeBron)
  gameArea.appendChild(lebron)

  setTimeout(() => {
    if (lebron.parentNode === gameArea) {
      lebron.remove()
    }
  }, LEBRON_LIFESPAN)
}

function clickLeBron(event) {
  if (!gameRunning) return
  gameScore++
  event.target.remove()
  updateGameDisplay()
}

function updateGameDisplay() {
  document.getElementById("gameScore").textContent = gameScore
  document.getElementById("gameCountdown").textContent = gameTimeLeft
}

function endGame() {
  gameRunning = false
  clearInterval(gameInterval)
  clearInterval(lebronSpawnInterval)
  document.getElementById("gameArea").innerHTML = ""
  document.getElementById("gameMessage").textContent = `game over! your final score is: ${gameScore} points! 🎉`
  document.getElementById("startGameBtn").style.display = "none"
  document.getElementById("resetGameBtn").style.display = "block"
}

function resetGame() {
  gameScore = 0
  gameTimeLeft = GAME_DURATION
  document.getElementById("gameArea").innerHTML = ""
  document.getElementById("gameMessage").textContent = ""
  updateGameDisplay()
  document.getElementById("startGameBtn").style.display = "block"
  document.getElementById("resetGameBtn").style.display = "none"
}

// lebron trivia game functionality
let triviaQuestions = []
let currentQuestionIndex = 0
let triviaScore = 0
let triviaGameRunning = false

async function loadTriviaQuestions() {
  try {
    const response = await fetch("lebron_trivia.json")
    const data = await response.json()
    triviaQuestions = data.questions
    document.getElementById("triviaTotalQuestions").textContent = triviaQuestions.length
  } catch (error) {
    console.error("error loading trivia questions:", error)
    triviaQuestions = [
      {
        question: "what team does lebron james currently play for?",
        options: ["miami heat", "cleveland cavaliers", "los angeles lakers", "golden state warriors"],
        answer: "los angeles lakers",
      },
      {
        question: "what is lebron's jersey number with the lakers?",
        options: ["6", "23", "3", "30"],
        answer: "6",
      },
    ]
    document.getElementById("triviaTotalQuestions").textContent = triviaQuestions.length
  }
}

async function startTriviaGame() {
  await loadTriviaQuestions()
  triviaGameRunning = true
  currentQuestionIndex = 0
  triviaScore = 0
  document.getElementById("triviaMessage").textContent = ""
  document.getElementById("startTriviaBtn").style.display = "none"
  document.getElementById("resetTriviaBtn").style.display = "none"
  document.getElementById("nextQuestionBtn").style.display = "none"

  updateTriviaScoreDisplay()
  displayQuestion()
}

function displayQuestion() {
  if (currentQuestionIndex >= triviaQuestions.length) {
    endTriviaGame()
    return
  }

  const question = triviaQuestions[currentQuestionIndex]
  document.getElementById("triviaQuestion").textContent = question.question
  const triviaOptions = document.getElementById("triviaOptions")
  triviaOptions.innerHTML = ""
  document.getElementById("triviaMessage").textContent = ""
  document.getElementById("nextQuestionBtn").style.display = "none"

  question.options.forEach((option) => {
    const button = document.createElement("button")
    button.className = "trivia-option-btn"
    button.textContent = option
    button.addEventListener("click", () => checkAnswer(option, question.answer, button))
    triviaOptions.appendChild(button)
  })
}

function checkAnswer(selectedOption, correctAnswer, clickedButton) {
  if (!triviaGameRunning) return

  Array.from(document.getElementById("triviaOptions").children).forEach((button) => {
    button.disabled = true
    if (button.textContent === correctAnswer) {
      button.classList.add("correct")
    } else {
      button.classList.add("incorrect")
    }
  })

  if (selectedOption === correctAnswer) {
    triviaScore++
    document.getElementById("triviaMessage").textContent = "correct! 🎉"
  } else {
    document.getElementById("triviaMessage").textContent = `wrong! the correct answer was "${correctAnswer}". 💔`
  }
  updateTriviaScoreDisplay()

  setTimeout(() => {
    document.getElementById("nextQuestionBtn").style.display = "block"
  }, 1000)
}

function updateTriviaScoreDisplay() {
  document.getElementById("triviaScoreDisplay").textContent = triviaScore
}

function displayNextQuestion() {
  currentQuestionIndex++
  displayQuestion()
}

function endTriviaGame() {
  triviaGameRunning = false
  document.getElementById("triviaQuestion").textContent = "trivia complete!"
  document.getElementById("triviaOptions").innerHTML = ""
  document.getElementById("triviaMessage").textContent =
    `you scored ${triviaScore} out of ${triviaQuestions.length}! 🎉`
  document.getElementById("nextQuestionBtn").style.display = "none"
  document.getElementById("resetTriviaBtn").style.display = "block"
}

function resetTriviaGame() {
  triviaScore = 0
  currentQuestionIndex = 0
  document.getElementById("triviaMessage").textContent = ""
  updateTriviaScoreDisplay()
  document.getElementById("startTriviaBtn").style.display = "block"
  document.getElementById("resetTriviaBtn").style.display = "none"
  document.getElementById("triviaQuestion").textContent = ""
  document.getElementById("triviaOptions").innerHTML = ""
}
