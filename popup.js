document.addEventListener("DOMContentLoaded", () => {
  const moodSelect = document.getElementById("mood");
  const diaryEntry = document.getElementById("diary-entry");
  const saveBtn = document.getElementById("save-btn");
  const wordCount = document.getElementById("word-count");
  const historyList = document.getElementById("history-list");
  const moodChartCanvas = document.getElementById("moodChart");

  // Load mood history and mood chart
  loadMoodHistory();
  loadMoodChart();
  handleMoodSelection(); // Check if mood has already been selected for today

  // Update word count for diary entry
  diaryEntry.addEventListener("input", () => {
    const words = diaryEntry.value.split(/\s+/).filter(Boolean).length;
    wordCount.textContent = `${words} / 100 words`;

    // Prevent exceeding word limit
    if (words > 100) {
      diaryEntry.value = diaryEntry.value.split(/\s+/).slice(0, 100).join(" ");
    }
  });

  // Save mood and diary entry
  saveBtn.addEventListener("click", () => {
    const mood = moodSelect.value;
    const entry = diaryEntry.value;
    const date = new Date().toLocaleDateString();
    const timestamp = new Date().getTime(); // current timestamp

    if (entry.trim() === "") {
      alert("Please write a diary entry.");
      return;
    }

    if (entry.split(/\s+/).filter(Boolean).length > 100) {
      alert("Diary entry must be 100 words or less.");
      return;
    }

    // Save mood and diary entry with timestamp in localStorage
    const moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
    moodHistory.push({ date, mood, entry, timestamp });
    localStorage.setItem("moodHistory", JSON.stringify(moodHistory));

    // Reload the history and chart
    loadMoodHistory();
    loadMoodChart();

    // If the mood is not already set for today, save it
    if (!isMoodSelectedForToday()) {
      const moodForToday = { mood, timestamp };
      localStorage.setItem("moodForToday", JSON.stringify(moodForToday));
    }

    // Clear the diary entry field
    diaryEntry.value = "";
  });

  // Load mood history
  function loadMoodHistory() {
    const moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
    historyList.innerHTML = ""; // Clear history list

    // Display the mood history
    moodHistory.forEach(item => {
      const listItem = document.createElement("li");
      listItem.textContent = `${item.date} - Mood: ${item.mood} - Entry: ${item.entry}`;
      historyList.appendChild(listItem);
    });
  }

  // Load mood chart (based on the moods of the month)
  function loadMoodChart() {
    const moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
    const currentMonth = new Date().getMonth();
    const moodCounts = {
      happy: 0,
      sad: 0,
      neutral: 0,
      excited: 0,
      bored: 0,
      angry: 0,
      confused: 0,
      surprised: 0,
      grateful: 0,
      love: 0,
    };

    // Count moods for the current month
    moodHistory.forEach(item => {
      const itemDate = new Date(item.timestamp);
      if (itemDate.getMonth() === currentMonth) {
        moodCounts[item.mood]++;
      }
    });

    // Prepare data for the chart
    const moodLabels = Object.keys(moodCounts);
    const moodData = Object.values(moodCounts);

    // Create the chart
    const chart = new Chart(moodChartCanvas, {
      type: 'bar', // You can use 'pie' or 'bar'
      data: {
        labels: moodLabels,
        datasets: [{
          label: 'Moods for This Month',
          data: moodData,
          backgroundColor: '#FF5733', // customize color
          borderColor: '#FF5733', // customize border color
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Check if mood for today is already selected
  function isMoodSelectedForToday() {
    const moodForToday = JSON.parse(localStorage.getItem("moodForToday"));
    if (moodForToday) {
      const currentDate = new Date().toLocaleDateString();
      const storedDate = new Date(moodForToday.timestamp).toLocaleDateString();
      return currentDate === storedDate;
    }
    return false;
  }

  // Disable the mood selection if already selected for today
  function handleMoodSelection() {
    if (isMoodSelectedForToday()) {
      moodSelect.disabled = true; // Disable the dropdown if mood already set for today
    } else {
      moodSelect.disabled = false; // Enable the dropdown if no mood is set for today
    }
  }
});
