Assumptions:

1. Assume different users can have totally identical quizzes (but different quizIds).

2. Assume quiz description can have all types of characters, e.g.non-alphanumeric, spaces, emojis etc. The only requirement is that quiz description must be within 100 characters long. (This concerns adminQuizCreate and adminDescriptionUpdate)

3. Assume in the email address, characters before @ can be any types of characters exluding emojis.

4. Assume first time registration counts as a successful login. (automatically makes the numSuccessfulLogin 1 of a user since registration).

5. Assume the adminQuizRemove function permanantly removes the all data in the quiz.

6. Assume the user email address is not case sensitive.