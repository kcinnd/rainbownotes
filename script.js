document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const flashlightRadius = 50;
    const colors = ['rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 0, 255, 0.5)'];
    let currentColorIndex = 0;
    let illuminatedSpots = [];

    // Draw illuminated spots
    function drawIlluminatedSpots() {
        illuminatedSpots.forEach(spot => {
            ctx.fillStyle = spot.color;
            ctx.beginPath();
            ctx.arc(spot.x, spot.y, flashlightRadius, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Draw the flashlight effect
    function drawFlashlight(x, y) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Redraw the black background

        drawIlluminatedSpots(); // Redraw illuminated spots

        // Draw the flashlight beam
        ctx.globalCompositeOperation = 'lighter'; // Use 'lighter' to blend the flashlight beam
        ctx.fillStyle = colors[currentColorIndex];
        ctx.beginPath();
        ctx.arc(x, y, flashlightRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over'; // Reset to default composite operation
    }

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        drawFlashlight(mouseX, mouseY);
    });

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        illuminatedSpots.push({ x: mouseX, y: mouseY, color: colors[currentColorIndex] });
        currentColorIndex = (currentColorIndex + 1) % colors.length;
    });

    // Initial canvas setup
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});
