import pygame
import sys
from snake import Snake
from food import Food
from score import Score

pygame.init()
WIDTH, HEIGHT = 800, 600
GRID_SIZE = 20
GRID_W, GRID_H = WIDTH // GRID_SIZE, HEIGHT // GRID_SIZE
FPS = 15
WHITE = (255, 255, 255)
RED = (255, 0, 0)
BLACK = (0, 0, 0)

screen = pygame.display.set_mode((WIDTH, HEIGHT))
font = pygame.font.Font(None, 36)
clock = pygame.time.Clock()

class Game:
    def __init__(self):
        self.snake = Snake([GRID_W//2, GRID_H//2], None, 3)
        self.food = Food(GRID_W, GRID_H)
        self.score = Score()

    def handle_input(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_UP and self.snake.direction != 'down':
                    self.snake.direction = 'up'
                elif event.key == pygame.K_DOWN and self.snake.direction != 'up':
                    self.snake.direction = 'down'
                elif event.key == pygame.K_LEFT and self.snake.direction != 'right':
                    self.snake.direction = 'left'
                elif event.key == pygame.K_RIGHT and self.snake.direction != 'left':
                    self.snake.direction = 'right'

    def update(self):
        self.snake.move()
        if self.snake.body[-1] == self.food.position:
            self.score.update_score(1)
            self.food.reset()
            self.snake.grow()
            
        if self.snake.check_collision_with_wall(GRID_W, GRID_H) or self.snake.check_collision_with_self():
            self.score.reset_score()
            self.snake.reset([GRID_W//2, GRID_H//2], 3)
            self.food.reset()

    def render(self):
        screen.fill(BLACK)
        for pos in self.snake.body:
            pygame.draw.rect(screen, WHITE, (pos[0]*GRID_SIZE, pos[1]*GRID_SIZE, GRID_SIZE, GRID_SIZE))
        pygame.draw.rect(screen, RED, (self.food.position[0]*GRID_SIZE, self.food.position[1]*GRID_SIZE, GRID_SIZE, GRID_SIZE))
        text = font.render(f'Score: {self.score.current_score}', True, WHITE)
        screen.blit(text, (10, 10))
        pygame.display.flip()

def main():
    game = Game()
    while True:
        game.handle_input()
        game.update()
        game.render()
        clock.tick(FPS)

if __name__ == "__main__":
    main()