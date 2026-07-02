async function test() {
  try {
    const allPrograms = [];
    for (let p = 1; p <= 5; p++) {
      const res = await fetch(`https://api.abroadlift.com/api/programs?page=${p}&limit=100`, {
        headers: { "X-API-Key": "vl0i3A4W7DxG1fJohzI2qmbedgp4EAYT" }
      });
      const json = await res.json();
      if (json.data) allPrograms.push(...json.data);
      await new Promise(r => setTimeout(r, 200));
    }
    const counts = {};
    allPrograms.forEach(prog => {
      counts[prog.level] = (counts[prog.level] || 0) + 1;
    });
    console.log("Program counts by level across 500 items:", counts);
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
