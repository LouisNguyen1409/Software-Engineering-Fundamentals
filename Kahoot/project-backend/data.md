```javascript
    // All the users of the program are stored in this array
    // Provides structure to the program and a way to itterate users with ease
let dataStore = {
  "users": [
    {
      "info": {
        "authUserId": 0,
        "name": "Marius Edmonds",
        "email": "marius@gmail.com",
        "password": "01fc3a9968d839a4953e117cb3db65be9f1343a85cb1811fad639198e7e13f47",
        "passwordList": [
          "01fc3a9968d839a4953e117cb3db65be9f1343a85cb1811fad639198e7e13f47"
        ],
        "numSuccessfulLogins": 1,
        "numFailedPasswordsSinceLastLogin": 0
      },
      "quizzes": [
        {
          "info": {
            "quizId": 1,
            "name": "Geography Game",
            "timeCreated": 1690938973,
            "timeLastEdited": 1690938975,
            "description": "This is a fun quiz",
            "numQuestions": 2,
            "questions": [
              {
                "questionId": 0,
                "question": "What is the capital of sweden?",
                "duration": 5,
                "points": 5,
                "answers": [
                  {
                    "answerId": 0,
                    "answer": "Stockholm",
                    "colour": "orange",
                    "correct": true
                  },
                  {
                    "answerId": 1,
                    "answer": "Helsinki",
                    "colour": "yellow",
                    "correct": false
                  }
                ],
                "thumbnailUrl": "./images/What_is_the_capital_of_sweden?.png"
              },
              {
                "questionId": 1,
                "question": "What is the capital of sweden?",
                "duration": 5,
                "points": 5,
                "answers": [
                  {
                    "answerId": 2,
                    "answer": "Stockholm",
                    "colour": "blue",
                    "correct": true
                  },
                  {
                    "answerId": 3,
                    "answer": "Helsinki",
                    "colour": "yellow",
                    "correct": false
                  }
                ],
                "thumbnailUrl": "./images/What_is_the_capital_of_sweden?.png"
              }
            ],
            "duration": 10,
            "thumbnailUrl": ""
          },
          "thumbnail": "./images/What_is_the_capital_of_sweden?.png"
        }
      ],
      "trash": []
    },
    {
      "info": {
        "authUserId": 1,
        "name": "Yepeng Lin",
        "email": "yepeng@gmail.com",
        "password": "eb549635343c441d1cd734488af46d23ca2d2dc1d0f249f6f12478f822aed144",
        "passwordList": [
          "eb549635343c441d1cd734488af46d23ca2d2dc1d0f249f6f12478f822aed144"
        ],
        "numSuccessfulLogins": 1,
        "numFailedPasswordsSinceLastLogin": 0
      },
      "quizzes": [
        {
          "info": {
            "quizId": 2,
            "name": "Geography Game",
            "timeCreated": 1690938973,
            "timeLastEdited": 1690938973,
            "description": "This is a fun quiz",
            "numQuestions": 0,
            "questions": [],
            "duration": 0,
            "thumbnailUrl": ""
          }
        }
      ],
      "trash": []
    }
  ],
  "tokens": [
    {
      "sessionId": "345",
      "userId": 0
    },
    {
      "sessionId": "346",
      "userId": 1
    }
  ],
  "sessionStatus": {
    "active": [
      {
        "sessionId": 1,
        "quizId": 1
      }
    ],
    "inactive": [
      {
        "sessionId": 1,
        "quizId": 1
      }
    ]
  },
  "sessions": [
  {
      "state": "LOBBY",
      "questionIndex": 0,
      "authUserId": 0,
      "atQuestion": 3,
      "autoStart": 3,
      "sessionId": 0,
      "players": [
        {
          "name": "hayden",
          "playerId": 1,
          "score": 1
        }
      ],
      "messages": [
          {
              "messageBody": "This is a message body",
              "playerId": 5546,
              "playerName": "Yuchao Jiang",
              "timeSent": 1683019484
          }
      ],
      "QuestionResults": [
          {
              "questionId": 1,
              "questionCorrectBreakdown": [
                  {
                      "answerId": 1,
                      "playersCorrect": [
                          "hayden",
                          "yuchao"
                      ]
                  }
              ],
              "averageAnswerTime": 10,
              "percentCorrect": 54
          }
      ],

      "metadata": {
        "quizId": 5546,
        "name": "This is the name of the quiz",
        "timeCreated": 1683019484,
        "timeLastEdited": 1683019484,
        "description": "This quiz is so we can have a lot of fun",
        "numQuestions": 1,
        "questions": [
          {
            "questionId": 5546,
            "question": "Who is the Monarch of England?",
            "duration": 4,
            "thumbnailUrl": "http://google.com/some/image/path.jpg",
            "points": 5,
            "answers": [
              {
                "answerId": 2384,
                "answer": "Prince Charles",
                "colour": "red",
                "correct": true
              }
            ]
          }
        ],
        "duration": 44,
        "thumbnailUrl": "http://google.com/some/image/path.jpg"
  }
}
  ],
  "quizLength": 2,
  "questionLength": 2,
  "answerLength": 4,
  "sessionLength": 3
}

```
[Optional] short description: 
Since quizzes are created under logged in user's authUserId, we decided to put it as a sub-object inside users. Also we decided to use array to store user information since this would allow us to loop through the data base to search for all types of information within user objects.