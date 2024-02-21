document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('musicCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const notes = [
        { x: 100, y: 200, image: 'note1.png', revealed: false },
        { x: 300, y: 400, image: 'note2.png', revealed: false },
        // Add more notes as needed
    ];

    const flashlightSize = 100; // Radius of the flashlight beam

    function drawScene() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        notes.forEach(note => {
            if (note.revealed) {
                const img = new Image();
                img.src = note.image;
                img.onload = function() {
                    ctx.drawImage(img, note.x - 50, note.y - 50, 100, 100); // Adjust size as needed
                };
            }
        });
    }

    function revealNoteAt(x, y) {
        notes.forEach(note => {
            const distance = Math.sqrt(Math.pow(note.x - x, 2) + Math.pow(note.y - y, 2));
            if (distance < flashlightSize) {
                note.revealed = true;
            }
        });
    }

    canvas.addEventListener('click', function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        revealNoteAt(x, y);
        drawScene();
    });

    drawScene(); // Initial drawing of the scene
});
