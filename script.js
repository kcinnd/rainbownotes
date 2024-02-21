ddocument.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const flashlightRadius = 50;
    const colors = ['rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 0, 255, 0.5)'];
    let currentColorIndex = 0;
    let notes = []; // Array to hold note objects
    let illuminatedSpots = []; // Array to hold positions and colors of illuminated spots

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Function to draw illuminated spots
    function drawIlluminatedSpots() {
        illuminatedSpots.forEach(spot => {
            ctx.fillStyle = spot.color;
            ctx.beginPath();
            ctx.arc(spot.x, spot.y, flashlightRadius, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Function to draw the flashlight effect
    function drawFlashlight(x, y) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Reset canvas

        drawIlluminatedSpots(); // Draw illuminated spots before the flashlight effect

        ctx.globalCompositeOperation = 'xor';
        ctx.fillStyle = colors[currentColorIndex];
        ctx.beginPath();
        ctx.arc(x, y, flashlightRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalCompositeOperation = 'source-over'; // Reset to default composite operation
    }

    // Function to initialize and draw notes
    function initAndDrawNotes() {
        if (notes.length === 0) {
            // Example initialization of a single note for demonstration
            // In a real scenario, you'd likely loop and create multiple notes with random positions
            notes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 100,
                color: 'white',
                isRevealed: false,
                audio: new Audio('path/to/your/audio.mp3') // Replace with the actual path to your audio file
            });
        }

        notes.forEach(note => {
            if (note.isRevealed) {
                ctx.fillStyle = note.color;
                ctx.beginPath();
                ctx.arc(note.x, note.y, note.size / 2, 0, Math.PI * 2); // Assuming notes are circular for simplicity
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

    // Click event to illuminate the clicked area, change flashlight color, and toggle note music
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        illuminatedSpots.push({ x: mouseX, y: mouseY, color: colors[currentColorIndex] }); // Illuminate clicked area

        currentColorIndex = (currentColorIndex + 1) % colors.length; // Change flashlight color

        notes.forEach(note => { // Toggle music for clicked notes
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

        drawFlashlight(mouseX, mouseY); // Redraw to immediately reflect the illuminated spot
    });

    // Initial canvas setup
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});
