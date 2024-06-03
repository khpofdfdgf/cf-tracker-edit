document.addEventListener("DOMContentLoaded", function() {
    async function fetchingProblems() {
        try {
            const url = "https://codeforces.com/api/problemset.problems";
            const response = await fetch(url);
            const data = await response.json();

            if (data.status !== "OK") {
                throw new Error("Failed to fetch problems");
            }

            const problems = data.result.problems;
            const tableBody = document.getElementById("problems-table").getElementsByTagName("tbody")[0];
            tableBody.innerHTML = "";

            problems.forEach((problem, index) => {
                const row = document.createElement("tr");
                const cellIndex = document.createElement("td");
                cellIndex.textContent = index + 1;
                row.appendChild(cellIndex);

                const cellName = document.createElement("td");
                const link = document.createElement("a");
                link.href = `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`;
                link.textContent = `${problem.index}. ${problem.name}`;
                link.target = "_blank";
                cellName.appendChild(link);
                row.appendChild(cellName);

                const cellRating = document.createElement("td");
                cellRating.textContent = problem.rating || "N/A";
                row.appendChild(cellRating);

                tableBody.appendChild(row);
            });

        } catch (err) {
            console.error(err);
            document.getElementById("problems-result").textContent = "An error occurred while fetching problems.";
            throw err;
        }
    }

    async function fetchingRanking() {
        try {
            const userId = document.getElementById("user-id-input").value;
            if (!userId) {
                alert("Please enter a valid User ID.");
                return;
            }

            const url = `https://codeforces.com/api/user.rating?handle=${userId}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.status !== "OK") {
                throw new Error("Failed to fetch ranking");
            }

            const ranking = data.result;
            const tableBody = document.getElementById("ranking-table").getElementsByTagName("tbody")[0];
            tableBody.innerHTML = "";

            ranking.forEach((rank, index) => {
                const row = document.createElement("tr");
                const cellIndex = document.createElement("td");
                cellIndex.textContent = index + 1;
                row.appendChild(cellIndex);

                const cellContest = document.createElement("td");
                cellContest.textContent = rank.contestId;
                row.appendChild(cellContest);

                const cellRank = document.createElement("td");
                cellRank.textContent = rank.rank;
                row.appendChild(cellRank);

                const cellRating = document.createElement("td");
                cellRating.textContent = rank.newRating;
                row.appendChild(cellRating);

                tableBody.appendChild(row);
            });

        } catch (err) {
            console.error(err);
            document.getElementById("ranking-result").textContent = "An error occurred while fetching ranking.";
            throw err;
        }
    }

    async function fetchingSubmissions() {
        try {
            const userId = document.getElementById("user-id-input").value;
            if (!userId) {
                alert("Please enter a valid User ID.");
                return;
            }

            const url = `https://codeforces.com/api/user.status?handle=${userId}&from=1&count=10`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.status !== "OK") {
                throw new Error("Failed to fetch submissions");
            }

            const submissions = data.result;
            const tableBody = document.getElementById("submissions-table").getElementsByTagName("tbody")[0];
            tableBody.innerHTML = "";

            submissions.forEach((submission, index) => {
                const row = document.createElement("tr");
                const cellIndex = document.createElement("td");
                cellIndex.textContent = index + 1;
                row.appendChild(cellIndex);

                const cellProblem = document.createElement("td");
                const link = document.createElement("a");
                link.href = `https://codeforces.com/contest/${submission.contestId}/submission/${submission.id}`;
                link.textContent = `${submission.problem.index}. ${submission.problem.name}`;
                link.target = "_blank";
                cellProblem.appendChild(link);
                row.appendChild(cellProblem);

                const cellVerdict = document.createElement("td");
                cellVerdict.textContent = submission.verdict || "N/A";
                row.appendChild(cellVerdict);

                const cellTime = document.createElement("td");
                const date = new Date(submission.creationTimeSeconds * 1000);
                cellTime.textContent = date.toLocaleString();
                row.appendChild(cellTime);

                tableBody.appendChild(row);
            });

        } catch (err) {
            console.error(err);
            document.getElementById("submissions-result").textContent = "An error occurred while fetching submissions.";
            throw err;
        }
    }

    document.getElementById("fetch-button").addEventListener("click", fetchingProblems);
    document.getElementById("fetch-ranking-button").addEventListener("click", fetchingRanking);
    document.getElementById("fetch-submissions-button").add
    document.getElementById("fetch-submissions-button").addEventListener("click", fetchingSubmissions);
});
