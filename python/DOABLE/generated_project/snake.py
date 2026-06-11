class Snake:
    def __init__(self, initial_position, initial_velocity, initial_length):
        self.body = [initial_position]
        self.direction = "right"
        self.length = initial_length

    def move(self):
        head = self.body[-1].copy()
        if self.direction == "up": head[1] -= 1
        elif self.direction == "down": head[1] += 1
        elif self.direction == "left": head[0] -= 1
        elif self.direction == "right": head[0] += 1
        self.body.append(head)
        if len(self.body) > self.length:
            self.body.pop(0)

    def grow(self):
        self.length += 1
        
    def check_collision_with_self(self):
        return self.body[-1] in self.body[:-1]
        
    def check_collision_with_wall(self, grid_width, grid_height):
        head = self.body[-1]
        return head[0] < 0 or head[0] >= grid_width or head[1] < 0 or head[1] >= grid_height
        
    def reset(self, initial_position, initial_length):
        self.body = [initial_position]
        self.direction = "right"
        self.length = initial_length