document.addEventListener("DOMContentLoaded", function () {
  const partyListElement = document.getElementById("party-list");
  const form = document.getElementById("new-party-form");
  const apiUrl =
    "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-FSA-ET-WEB-PT-SF/events";

  const fetchParties = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("API response data:", data);

      if (!data || !Array.isArray(data)) {
        throw new Error("The response does not contain an array of events");
      }

      const parties = data; // Assuming the response is an array
      partyListElement.innerHTML = "";
      parties.forEach((party) => {
        const partyElement = document.createElement("div");
        partyElement.innerHTML = `
                  <h3>${party.name}</h3>
                  <p>Date: ${party.date}, Time: ${party.time}</p>
                  <p>Location: ${party.location}</p>
                  <p>Description: ${party.description}</p>
                  <button onclick="deleteParty('${party.id}')">Delete</button>
              `;
        partyListElement.appendChild(partyElement);
      });
    } catch (error) {
      console.error("Error fetching parties:", error);
      // Optionally, display an error message on the webpage
    }
  };

  form.onsubmit = async (e) => {
    e.preventDefault();
    const newParty = {
      name: document.getElementById("name").value,
      date: new Date(document.getElementById("date").value)
        .toISOString()
        .split("T")[0],
      time: document.getElementById("time").value,
      location: document.getElementById("location").value,
      description: document.getElementById("description").value,
    };

    console.log("New party data:", newParty);

    if (
      !newParty.name ||
      !newParty.date ||
      !newParty.time ||
      !newParty.location
    ) {
      console.error("Please fill all required fields.");
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newParty),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Get more details from the response body
        console.error(
          `Server responded with error: ${response.status}`,
          errorData
        );
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchParties(); // Refresh the list after a successful POST
    } catch (error) {
      console.error("Error creating a new party:", error);
      // Optionally, display an error message on the webpage
    }
  };

  window.deleteParty = async (id) => {
    await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
    });
    fetchParties();
  };

  fetchParties();
});
