import random
class Food:
    def __init__(self, width, height):
        self.width = width
        self.height = height
        self.position = self.generate_new_position()

    def generate_new_position(self):
        return [random.randint(0, self.width - 1), random.randint(0, self.height - 1)]

    def reset(self):
        self.position = self.generate_new_position()