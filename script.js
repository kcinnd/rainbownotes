document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const flashlightRadius = 50;
    const colors = ['rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 0, 255, 0.5)'];
    let currentColorIndex = 0;
    let notes = []; // Array to hold note objects
    let revealedSpots = []; // Array to hold positions where the flashlight has clicked

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Function to draw the flashlight effect
    function drawFlashlight(x, y) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Reset canvas

        // Reveal spots where the flashlight has clicked
        revealedSpots.forEach(spot => {
            ctx.fillStyle = spot.color;
            ctx.beginPath();
            ctx.arc(spot.x, spot.y, flashlightRadius, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw the flashlight beam
        ctx.globalCompositeOperation = 'xor';
        ctx.fillStyle = colors[currentColorIndex];
        ctx.beginPath();
        ctx.arc(x, y, flashlightRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
    }

    // Function to initialize and draw notes
    function initAndDrawNotes() {
        // Placeholder: Initialize your notes here with random positions
        // For demonstration, let's create a single note
        if (notes.length === 0) {
            notes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 100,
                color: 'white', // Note color
                isRevealed: false,
                audio: new Audio('path/to/your/audio.mp3') // Placeholder for audio path
            });
        }

        // Draw notes that are revealed
        notes.forEach(note => {
            if (note.isRevealed) {
                ctx.fillStyle = note.color;
                ctx.beginPath();
                ctx.arc(note.x, note.y, note.size / 2, 0, Math.PI * 2); // Drawing notes as circles for simplicity
                ctx.fill();
            }
        });
    }

    // Function to reveal notes within the flashlight beam
    function revealNotes(x, y) {
        notes.forEach(note => {
            const dx = note.x - x;
            const dy = note.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < flashlightRadius + note.size / 2) {
                note.isRevealed = true;
            }
        });
    }

    // Mouse move event to update flashlight position and reveal notes
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        drawFlashlight(mouseX, mouseY);
        revealNotes(mouseX, mouseY);
        initAndDrawNotes();
    });

    // Click event to change flashlight color and add revealed spot
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Add current position to revealed spots
        revealedSpots.push({x: mouseX, y: mouseY, color: colors[currentColorIndex]});

        // Change flashlight color
        currentColorIndex = (currentColorIndex + 1) % colors.length;

        // Check if a note is clicked and play/pause its audio
        notes.forEach(note => {
            const dx = note.x - mouseX;
            const dy = note.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (note.isRevealed && distance < note.size / 2) {
                if (note.audio.paused) {
                    note.audio.play();
                } else {
                    note.audio.pause();
                }
            }
        });
    });

    // Initial canvas setup
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});
