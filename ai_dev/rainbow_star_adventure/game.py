import pgzrun
import random
import pygame
import math
from pygame.rect import Rect

# Game window settings
WIDTH = 800
HEIGHT = 600
TITLE = "Rainbow Star Adventure"

# Enable window resizing
import os
os.environ['SDL_VIDEO_CENTERED'] = '1'

# Window resize event handler
def on_resize(event):
    """Handle window resize events"""
    global WIDTH, HEIGHT
    WIDTH, HEIGHT = event.size
    # Update button positions
    buttons['pause']['rect'] = Rect(10, 10, 100, 40)
    buttons['restart']['rect'] = Rect(120, 10, 120, 40)
    buttons['quit']['rect'] = Rect(250, 10, 80, 40)

# Button settings
buttons = {
    'pause': {'rect': Rect(10, 10, 100, 40), 'text': 'Pause', 'color': (0, 0, 255), 'hover_color': (0, 0, 200)},
    'restart': {'rect': Rect(120, 10, 120, 40), 'text': 'Restart', 'color': (0, 128, 0), 'hover_color': (0, 100, 0)},
    'quit': {'rect': Rect(250, 10, 80, 40), 'text': 'Quit', 'color': (255, 0, 0), 'hover_color': (200, 0, 0)}
}

# Check if mouse is over a button
def is_mouse_over(rect):
    """Check if mouse is over a button"""
    return rect.collidepoint(pygame.mouse.get_pos())

# Player settings
player = {}
player['x'] = WIDTH // 2
player['y'] = HEIGHT // 2
player['speed'] = 5
player['color'] = (255, 215, 0)  # Gold
player['mouth_phase'] = 0  # For mouth animation

# Star settings
stars = []
star_count = 10
for _ in range(star_count):
    star = {}
    star['x'] = random.randint(50, WIDTH - 50)
    star['y'] = random.randint(50, HEIGHT - 50)
    star['color'] = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
    stars.append(star)

# Obstacle settings
obstacles = []
obstacle_count = 5
for _ in range(obstacle_count):
    obstacle = {}
    obstacle['x'] = random.randint(50, WIDTH - 50)
    obstacle['y'] = random.randint(50, HEIGHT - 50)
    obstacle['speed_x'] = random.choice([-2, 2])
    obstacle['speed_y'] = random.choice([-2, 2])
    # Use evil color: dark purple
    obstacle['color'] = (102, 51, 153)  # Dark purple
    obstacles.append(obstacle)

# Game state
score = 0
time_left = 60
game_over = False
game_paused = False
game_started = False

# Color settings
BACKGROUND_COLORS = [(255, 182, 193), (173, 216, 230), (144, 238, 144), (255, 255, 182), (221, 160, 221)]
current_bg_color = 0

# Initialize game resources
def init_game():
    """Initialize game resources"""
    global score, time_left, game_over, stars, obstacles, player
    score = 0
    time_left = 60
    game_over = False
    
    # Reset player
    player['x'] = WIDTH // 2
    player['y'] = HEIGHT // 2
    player['mouth_phase'] = 0
    
    # Reset stars
    stars = []
    for _ in range(star_count):
        star = {}
        star['x'] = random.randint(50, WIDTH - 50)
        star['y'] = random.randint(50, HEIGHT - 50)
        star['color'] = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
        stars.append(star)
    
    # Reset obstacles
    obstacles = []
    for _ in range(obstacle_count):
        obstacle = {}
        obstacle['x'] = random.randint(50, WIDTH - 50)
        obstacle['y'] = random.randint(50, HEIGHT - 50)
        obstacle['speed_x'] = random.choice([-2, 2])
        obstacle['speed_y'] = random.choice([-2, 2])
        # Use evil color: dark purple
        obstacle['color'] = (102, 51, 153)  # Dark purple
        obstacles.append(obstacle)

# Draw game interface
def draw():
    """Draw game interface"""
    screen.fill(BACKGROUND_COLORS[current_bg_color])
    
    # Draw start screen
    if not game_started:
        screen.draw.text("Rainbow Star Adventure", center=(WIDTH // 2, HEIGHT // 2 - 100), fontsize=60, color="black")
        screen.draw.text("Click anywhere to start", center=(WIDTH // 2, HEIGHT // 2), fontsize=40, color="black")
        screen.draw.text("Use arrow keys to move", center=(WIDTH // 2, HEIGHT // 2 + 50), fontsize=30, color="black")
        screen.draw.text("Collect stars, avoid obstacles", center=(WIDTH // 2, HEIGHT // 2 + 90), fontsize=30, color="black")
        return
    
    # Draw player (Pac-Man-like character)
    # Draw body
    screen.draw.filled_circle((player['x'], player['y']), 30, player['color'])
    # Draw eyes
    screen.draw.filled_circle((player['x'] - 10, player['y'] - 10), 5, (255, 255, 255))
    screen.draw.filled_circle((player['x'] + 10, player['y'] - 10), 5, (255, 255, 255))
    screen.draw.filled_circle((player['x'] - 10, player['y'] - 10), 2, (0, 0, 0))
    screen.draw.filled_circle((player['x'] + 10, player['y'] - 10), 2, (0, 0, 0))
    # Draw animated mouth (more realistic human-like mouth)
    mouth_openness = abs(math.sin(player['mouth_phase'])) * 18
    # Calculate mouth parameters
    mouth_width = 28
    mouth_center = player['y'] + 8
    
    # Draw upper lip (more curved, like human upper lip)
    pygame.draw.arc(screen.surface, (0, 0, 0), 
                   (player['x'] - mouth_width//2, mouth_center - mouth_openness - 5, mouth_width, mouth_openness + 5), 
                   math.pi, 0, 2)
    
    # Draw lower lip (more curved, like human lower lip)
    pygame.draw.arc(screen.surface, (0, 0, 0), 
                   (player['x'] - mouth_width//2, mouth_center, mouth_width, mouth_openness), 
                   0, math.pi, 2)
    
    # Connect the ends to form a closed loop
    screen.draw.line((player['x'] - mouth_width//2, mouth_center), 
                    (player['x'] - mouth_width//2, mouth_center - mouth_openness), 
                    (0, 0, 0))
    screen.draw.line((player['x'] + mouth_width//2, mouth_center), 
                    (player['x'] + mouth_width//2, mouth_center - mouth_openness), 
                    (0, 0, 0))
    
    # Draw stars (Five-pointed stars)
    for star in stars:
        # Draw five-pointed stars
        size = 20
        outer_points = []
        inner_points = []
        
        # Calculate 5 outer vertices
        for i in range(5):
            angle = i * 72 - 90  # Start from top, rotate counterclockwise
            x = star['x'] + size * math.cos(math.radians(angle))
            y = star['y'] + size * math.sin(math.radians(angle))
            outer_points.append((x, y))
        
        # Calculate 5 inner vertices
        inner_size = size * 0.382  # Golden ratio
        for i in range(5):
            angle = (i * 72 + 36) - 90  # Inner vertex angle
            x = star['x'] + inner_size * math.cos(math.radians(angle))
            y = star['y'] + inner_size * math.sin(math.radians(angle))
            inner_points.append((x, y))
        
        # Build 10-point star polygon (outer-inner-outer-inner...)
        star_points = []
        for i in range(5):
            star_points.append(outer_points[i])
            star_points.append(inner_points[i])
        
        # Fill star interior
        pygame.draw.polygon(screen.surface, star['color'], star_points)
        # Draw star border
        for i in range(len(star_points)):
            screen.draw.line(star_points[i], star_points[(i + 1) % len(star_points)], (0, 0, 0))
    
    # Draw obstacles (Bad guy形象)
    for obstacle in obstacles:
        # Draw body
        screen.draw.filled_circle((obstacle['x'], obstacle['y']), 20, obstacle['color'])
        # Draw eyes
        screen.draw.filled_circle((obstacle['x'] - 8, obstacle['y'] - 8), 4, (255, 255, 255))
        screen.draw.filled_circle((obstacle['x'] + 8, obstacle['y'] - 8), 4, (255, 255, 255))
        screen.draw.filled_circle((obstacle['x'] - 8, obstacle['y'] - 8), 2, (255, 0, 0))
        screen.draw.filled_circle((obstacle['x'] + 8, obstacle['y'] - 8), 2, (255, 0, 0))
        # Draw evil mouth
        screen.draw.line((obstacle['x'] - 12, obstacle['y'] + 5), (obstacle['x'] + 12, obstacle['y'] + 5), (255, 0, 0))
    
    # Draw score and time
    screen.draw.text(f"Score: {score}", (WIDTH - 150, 10), fontsize=30, color="black")
    screen.draw.text(f"Time: {int(time_left)}", (WIDTH - 150, 50), fontsize=30, color="black")
    
    # Draw pause screen
    if game_paused:
        screen.draw.text("Game Paused", center=(WIDTH // 2, HEIGHT // 2 - 50), fontsize=60, color="blue")
        screen.draw.text("Click anywhere to continue", center=(WIDTH // 2, HEIGHT // 2 + 50), fontsize=30, color="black")
    
    # Draw game over screen
    if game_over:
        screen.draw.text("Game Over!", center=(WIDTH // 2, HEIGHT // 2 - 50), fontsize=60, color="red")
        screen.draw.text(f"Final Score: {score}", center=(WIDTH // 2, HEIGHT // 2 + 50), fontsize=40, color="black")
        screen.draw.text("Click anywhere to restart", center=(WIDTH // 2, HEIGHT // 2 + 100), fontsize=30, color="black")
    
    # Draw game control buttons
    for name, button in buttons.items():
        # Check if mouse is over button
        if is_mouse_over(button['rect']):
            color = button['hover_color']
        else:
            color = button['color']
        
        # Draw button
        screen.draw.filled_rect(button['rect'], color)
        # Draw button text
        screen.draw.text(button['text'], center=(button['rect'].centerx, button['rect'].centery), fontsize=20, color="white")

# Update game state
def update():
    """Update game state"""
    global score, time_left, game_over, current_bg_color, game_paused, game_started
    
    # Don't update game state if game hasn't started, is paused, or is over
    if not game_started or game_paused or game_over:
        return
    
    # Animate player's mouth
    player['mouth_phase'] += 0.1
    if player['mouth_phase'] > math.pi * 2:
        player['mouth_phase'] = 0
    
    # Move player
    if keyboard.left and player['x'] > 0:
        player['x'] -= player['speed']
    if keyboard.right and player['x'] < WIDTH:
        player['x'] += player['speed']
    if keyboard.up and player['y'] > 0:
        player['y'] -= player['speed']
    if keyboard.down and player['y'] < HEIGHT:
        player['y'] += player['speed']
    
    # Move obstacles
    for obstacle in obstacles:
        obstacle['x'] += obstacle['speed_x']
        obstacle['y'] += obstacle['speed_y']
        
        # Obstacle boundary detection
        if obstacle['x'] < 0 or obstacle['x'] > WIDTH:
            obstacle['speed_x'] *= -1
        if obstacle['y'] < 0 or obstacle['y'] > HEIGHT:
            obstacle['speed_y'] *= -1
    
    # Detect star collision
    for star in stars[:]:
        # Simple collision detection
        distance = ((player['x'] - star['x']) ** 2 + (player['y'] - star['y']) ** 2) ** 0.5
        if distance < 45:  # Player radius 30 + star radius 15
            stars.remove(star)
            score += 1
            
            # Add new star
            new_star = {}
            new_star['x'] = random.randint(50, WIDTH - 50)
            new_star['y'] = random.randint(50, HEIGHT - 50)
            new_star['color'] = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
            stars.append(new_star)
            
            # Randomly change background color
            current_bg_color = random.randint(0, len(BACKGROUND_COLORS) - 1)
    
    # Detect obstacle collision
    for obstacle in obstacles:
        # Simple collision detection
        distance = ((player['x'] - obstacle['x']) ** 2 + (player['y'] - obstacle['y']) ** 2) ** 0.5
        if distance < 50:  # Player radius 30 + obstacle radius 20
            game_over = True
    
    # Countdown
    if time_left > 0:
        time_left -= 0.01
    else:
        game_over = True

# Handle keyboard events
def on_key_down(key):
    """Handle keyboard events"""
    global game_started, game_paused, game_over
    
    # Start game
    if key == keys.SPACE and not game_started:
        game_started = True
    
    # Pause/resume game
    elif key == keys.SPACE and game_started and not game_over:
        game_paused = not game_paused
    
    # Restart game
    elif key == keys.SPACE and game_over:
        init_game()

# Handle mouse click events
def on_mouse_down(pos):
    """Handle mouse click events"""
    global game_started, game_paused, game_over
    
    # Start game
    if not game_started:
        game_started = True
        return
    
    # Continue game
    if game_paused:
        game_paused = False
        return
    
    # Restart game
    if game_over:
        init_game()
        return
    
    # Check button clicks
    for name, button in buttons.items():
        if button['rect'].collidepoint(pos):
            if name == 'pause':
                game_paused = not game_paused
            elif name == 'restart':
                init_game()
            elif name == 'quit':
                import sys
                sys.exit()

# Run game
pgzrun.go()