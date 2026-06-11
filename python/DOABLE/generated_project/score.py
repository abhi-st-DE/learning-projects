class Score:
    def __init__(self):
        """
        Initialize the Score class with attributes for current score and high score.
        """
        self.current_score = 0
        self.high_score = 0

    def update_score(self, points):
        """
        Update the current score by adding the given points.

        Args:
            points (int): The points to add to the current score.
        """
        self.current_score += points

    def check_high_score(self):
        """
        Check if the current score is higher than the high score. If it is, update the high score.

        Returns:
            bool: True if a new high score is achieved, False otherwise.
        """
        if self.current_score > self.high_score:
            self.high_score = self.current_score
            return True
        return False

    def reset_score(self):
        """
        Reset the current score to 0.
        """
        self.current_score = 0