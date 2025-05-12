import {Router} from 'express';
import {checkString, checkDateReleased, checkForm, checkUserGameInfo, checkId, checkRating, stringToNumber} from '../helpers.js';
import games from '../data/games.js';
import users from "../data/users.js";
import comments from "../data/comments.js";

const router = Router();

router.route('/')
    .get(async (req, res) => {
        try {

            // Get list of all games.
            const gamesList = await games.getAllGames(true);

            // Get user document of the logged-in user.
            const user = await users.getUserById(req.session.user._id);

            const recs = await games.getRecommendations(user._id);

            // Add a property to all games that are already in the logged-in user's profile.
            for (let i = 0; i < gamesList.length; i++) {
                for (let userGame of user.games) {
                    if (gamesList[i].name === userGame.gameName) {
                        gamesList[i].game_added = true;
                        continue;
                    }
                }
            }

            const count = recs.length;

            let n = 0;

            console.log(recs);
            
            while (n !== count){
                for (let i = 0; i < gamesList.length; i++) {
                    if(gamesList[i].name === recs[n]){
                        if(i !== n){
                            let temp = gamesList[i];
                            gamesList[i] = gamesList[n];
                            gamesList[n] = temp;
                        } 
                        n++;
                    }
                }
            }

            return res.render('game-list', {
                games: gamesList,
                title: "Games List",
                stylesheet: "/public/css/game-list.css",
                user: req.session.user,
                recs: count,
                notZero: recs.length !== 0
            });
        } catch (error) {
            return res.status(error.status || 500).render("error", {
                status: error.status || 500,
                error_message: `${error.function}: ${error.error}`,
                title: `${error.status || 500} Error`,
                stylesheet: "/public/css/error.css"
            });
        }
    })
    .post(async (req, res) => {
        try {
            const {name, dateReleased, form} = req.body;
            name = checkString(name, "name", "POST game/list");
            dateReleased = checkDateReleased(dateReleased, "POST game/list");
            form = checkForm(form);
            if(!req.session.user || !req.session.user.admin){
                //Not logged in users and non-admins cannot add a game
                return res.status(403).json({error: "Permission Denied"});
            }
            const game = await games.createGame(name, dateReleased, form);
            const gamesList = await games.getAllGames();
            return res.render('game-list', {
                games: gamesList,
                title: "Games List",
                stylesheet: "/public/css/game-list.css",
            });
        } catch (error) {
            return res.render("add-game", {
                title: "Create a Game",
                stylesheet: "/public/css/add-game.css",
                script: "/public/js/add-game.js",
                gameFormError: "hidden",
                gameFormError_message: error.gameFormError
            });
        }
    })
    .delete()

router.route('/new')
    .get(async (req, res) => {
        try {
            if(!req.session.user || !req.session.user.admin){
                //Not logged in users and non-admins cannot see the create game form
                return res.status(403).render("error", {
                    status: 403,
                    error_message: "Permission Denied. Must be an admin.",
                    title: "403 Error",
                    stylesheet: "/public/css/error.css",
                    link: "/games/"
                  });
            }
            return res.render("add-game", {
                title: "Create a Game",
                stylesheet: "/public/css/add-game.css",
                script: "/public/js/add-game.js"
            });
        } catch (error) {
            return res.status(error.status).render("error", {
                status: error.status,
                error_message: `${error.function}: ${error.error}`,
                title: `${error.status} Error`,
                stylesheet: "/public/css/error.css",
                link: "/games/"
            });
        }
    });

router.route('/:id')
    .get(async (req, res) => {
        try{
            const id = checkString(req.params.id, 'Game id','GET game/:id');
            const game = await games.getGameById(id);

            const user = await users.getUserById(req.session.user._id);

            let already_reviewed = false;
            for (let review of game.reviews) {
                if (review.userId === req.session.user._id) {
                    already_reviewed = true;
                }
            }

            return res.render('game-page', {
                title: game.name,
                stylesheet: "/public/css/game-page.css",
                game: game,
                script: "/public/js/game-page.js",
                is_admin: user.admin,
                user: user,
                not_reviewed: !already_reviewed
            });
        } catch (error) {
            return res.status(error.status).render("error", {
                status: error.status,
                error_message: `${error.function}: ${error.error}`,
                title: `${error.status} Error`,
                stylesheet: "/public/css/error.css"
            });
        }
    })
    .delete(async (req, res) => {

        // Prevent non-admins from deleting games.
        if (!req.session.user.admin) {
            return res.status(403).render("error", {
                title: "403 Forbidden",
                stylesheet: "/public/css/error.css",
                status: 403,
                error_message: "This action is forbidden."
            });
        }

        try {

            req.params.id = checkString(req.params.id, 'Game id','GET game/:id');
            
            await games.removeGame(req.params.id);

            return res.redirect("/games");

        } catch (e) {

            return res.status(e.status).render("error", {
                title: `${e.status} Error`,
                stylesheet: "/public/css/error.css",
                status: e.status,
                error_message: e.error
            });

        }

    });
    //.post() //addGame for the admin, renders add-gae view
    
router
  .route("/:id/form")
  .get(async (req, res) => {
    try {
      const id = checkString(req.params.id, "Game id", "GET game/:id/form");

      const user = await users.getUserById(req.session.user._id); 
      const game = await games.getGameById(id);
      const userGames = user.games;
      const gameNames = [];

      for(let i = 0; i < userGames.length; i++){
        gameNames.push(userGames[i].gameName);
      } 
      //If the game is in the users data already then it will load the form with PATCH method
      //Todo: get the users answers on the screen
      if (!gameNames.includes(game.name)){
        return res.render("game-form", {
            update: false,
            game: game,
            title: `Add ${game.name} to profile`,
            stylesheet: "/public/css/game-form.css",
            script: "/public/js/gameForm.js",
        });

      } else {

        console.log('1')
        return res.render("game-form", {
            update: true,
            game: game,
            title: `Edit ${game.name}`,
            stylesheet: "/public/css/game-form.css",
            script: "/public/js/gameForm.js"
        });

      }
    } catch (error) {
      return res.status(error.status).render("error", {
        status: error.status,
        error_message: `${error.function}: ${error.error}`,
        title: `${error.status} Error`,
        stylesheet: "/public/css/error.css"
      });
    }
  })
  .post(async(req, res) => {
    try {
        const gameId = checkString(
            req.params.id,
            "Game id",
            "POST games/:id/form"
        );

        let body = req.body;
        let userGameInfo = [];
        for(const elem in body){        // Fill in the userGameInfo array using the req.body values
            userGameInfo.push({field_name: elem, value: body[elem]});
        }
        const game = await games.getGameById(gameId);
        userGameInfo = checkUserGameInfo(userGameInfo, game, "Game form POST route");
        const result = await users.addGame(req.session.user._id, gameId, userGameInfo);
        if (!result || !result.gameAdded) {
            return res.status(500).render("error", {
                status: 500,
                error_message: "Internal Server Error",
                title: `500 Error`,
                stylesheet: "/public/css/error.css"
            });
        }
        return res.redirect("/users/" + req.session.user._id);
        


    } catch (error) {
      return res.status(error.status).render("error", {
        status: error.status,
        error_message: `${error.function}: ${error.error}`,
        title: `${error.status} Error`,
        stylesheet: "/public/css/error.css"
      });
    }
  })
    //DELETE AND PATCH BELOW
  .delete(async (req, res) => {

    try {
        
        req.params.id = checkId(req.params.id, "DELETE /game/:gameId/form", "game");

        if(!req.session.user){ 
            return res.status(403).json({error: "Permission Denied"});
        }


    } catch (e) {
        return res.status(500).json({error: e.error});
    }

    try {

        const uid = req.session.user._id;

        const user = await users.getUserById(uid);
        const game = await games.getGameById(req.params.id);

        const userGames = user.games;

        //Looks for the game in the users lists of games 
        let gameSearch = false;
        for(let i in userGames){
            if (userGames[i].gameId.toString() === req.params.id.toString()){
                gameSearch = true; 
                break;
            } 
        }

        if (!gameSearch){
            return res.status(404).json({error: "Game Not Found"});
        }

        //Will throw error if something goes wrong
        const result = await users.removeGame(uid, req.params.id);
        if (!result || !result.gameRemoved) {
            return res.status(500).render("error", {
                status: 500,
                error_message: "Internal Server Error",
                title: `500 Error`,
                stylesheet: "/public/css/error.css"
            });
        }

        const updatedUser = await users.getUserById(req.session.user._id)
        return res.redirect(`/users/${req.session.user._id}`);
    } catch (error) {

        return res.status(error.status).render("error", {
            status: error.status,
            error_message: `${error.function}: ${error.error}`,
            title: `${error.status} Error`,
            stylesheet: "/public/css/error.css"
          });

    }
  })
  .patch(async (req, res) => {
    try {
        req.params.gameId = checkId(req.params.id, "PATCH /game/:gameId", "game");
    } catch (e) {
        return res.status(500).json({error: e.error});
    }

    try  {

        let userGameInfo = [];

        for(const elem in req.body){
            userGameInfo.push({field_name: elem, value: req.body[elem]});
        }


        const uid = req.session.user._id;

        const user = await users.getUserById(uid);

        const game = await games.getGameById(req.params.gameId);
        userGameInfo = checkUserGameInfo(userGameInfo, game, "Game form PATCH route");

        const result = await users.updateGame(user._id, game._id, userGameInfo);

        if (!result || !result.gameUpdated) {
            return res.status(500).render("error", {
                status: 500,
                error_message: "Internal Server Error",
                title: `500 Error`,
                stylesheet: "/public/css/error.css"
            });
        }

        const updatedUser = await users.getUserById(uid);
        return res.redirect("/users/" + req.session.user._id);

    } catch (error){

        return res.status(error.status).render("error", {
            status: error.status,
            error_message: `${error.function}: ${error.error}`,
            title: `${error.status} Error`,
            stylesheet: "/public/css/error.css"
          });

    }
  });

router
    .route("/:id/reviews")
    .post(async (req, res) => {
        try {
            const gameId = checkId(req.params.id, "POST /:id/review", "Game");
            if(!req.session.user){ //get user, check if logged in
               return res.status(403).render("error", {
                status: 403,
                error_message: "Permission Denied. Must be logged in to post a review.",
                stylesheet: "/public/css/error.css",
                title: "403 Error",
                link: "/"
               });
            }
            const userId = checkString(req.session.user._id, "POST /:id/review", "User");
            const game = await games.getGameById(gameId);
            let alreadyReviewed = false;
            for (let review of game.reviews) {
                if(review.userId.toString() === userId){
                    alreadyReviewed = true;
                    break;
                }
            }

            if(alreadyReviewed){ //duplicate review check
                return res.status(400).render("error", {
                    status: 400,
                    error_message: "You can only leave one review per game.",
                    stylesheet: "/public/css/error.css",
                    title: "400 Error",
                    link: `/games/${gameId}`
                  });
            }
            let {title, content, rating} = req.body; //input validation
            title = title.trim();
            content = content.trim();
            rating = stringToNumber(rating, "addReview");
            rating = checkRating(rating, "addReview");
            await games.addReview(gameId, userId, title, content, rating);
            return res.redirect(`/games/${gameId}`);
        } catch (error) {
            return res.status(error.status || 500).render("error", {
                status: error.status || 500,
                error_message: error.error,
                stylesheet: "/public/css/error.css",
                title: `${error.status || 500} Error`
            });
        }
    });
router
    .route("/:gameId/reviews/:reviewId")
    .patch(async (req, res) => {
        try {
            const gameId = checkId(req.params.gameId, "PATCH /:gameId/reviews/:reviewId", "Game");
            //check logged in and users own review
            if(!req.session.user){ //get user, check if logged in
                return res.status(403).render("error", {
                 status: 403,
                 error_message: "Permission Denied. Must be logged in to post a review.",
                 stylesheet: "/public/css/error.css",
                 title: "403 Error",
                 link: "/"
                });
            }
            const game = await games.getGameById(gameId);
            const reviewId = checkId(req.params.reviewId, "PATCH /:gameId/reviews/:reviewId", "Review");
            let own_review = false;
            for (let i = 0; i < game.reviews.length; i++) { //find the corresponding review
                if (game.reviews[i]._id.toString() === reviewId) {
                    if(game.reviews[i].userId === req.session.user._id){
                        own_review = true;
                        break;
                    }
                }
            }
            
            if(!own_review){
                return res.status(403).render("error", {
                    status: 403,
                    error_message: "Permission Denied. You can only edit your own review.",
                    stylesheet: "/public/css/error.css",
                    title: "403 Error",
                    link: `/games/${gameId}`
                   });
            }
            
            let {title, content, rating} = req.body;
            title = title.trim();
            content = content.trim();
            rating = stringToNumber(rating, "addReview");
            rating = checkRating(rating, "addReview");
            await games.updateReview(reviewId, title, content, rating); //update the review
            return res.redirect(`/games/${gameId}`);
        } catch (error) {
            return res.status(error.status || 500).render("error", {
                status: error.status || 500,
                error_message: error.error,
                stylesheet: "/public/css/error.css",
                title: `${error.status || 500} Error`
            });
        }
    })
    .delete(async (req, res) => {
        try {

            // Input validation
            const gameId = checkId(req.params.gameId, "DELETE /:gameId/reviews/:reviewId", "Game");
            const reviewId = checkId(req.params.reviewId, "DELETE /:gameId/reviews/:reviewId", "Review");

            // Get the review.
            const review = await games.getReviewById(req.params.reviewId);

            // Check if the review was made by the logged-in user.
            if (review.userId.toString() === req.session.user._id.toString()) {
                await games.removeReview(reviewId);
                console.log("delete-1");
                return res.redirect(`/games/${gameId}`);
            } else {
                return res.status(403).render("error", {
                    status: 403,
                    error_message: "This action is forbidden.",
                    stylesheet: "/public/css/error.css",
                    title: "403 Error"
                })
            }
        } catch (error) {
            console.log("delete-2");
            return res.status(error.status || 500).render("error", {
                status: error.status || 500,
                error_message: error.error,
                stylesheet: "/public/css/error.css",
                title: `${error.status || 500} Error`
            });
        }
    });

router
    .route("/:id/comment")
    .post(async (req, res) => {

        // Validate the "id" path variable.
        try {

            req.params.id = checkId(req.params.id, "POST /:id", "game");
        
        } catch (e) {

            return res.status(e.status).render('error', {
                status: e.status,
                error_message: e.error,
                stylesheet: "/public/css/error.css",
                title: `${e.status} Error`
            });
        }

        // Add the comment.
        let game;
        try {
            game = await games.getGameById(req.params.id);
            await comments.createComment("game", req.params.id, req.session.user._id, req.body.comment);
        } catch (e) {
            return res.status(e.status).render('game-page', {
                game: game,
                title: `${req.session.user.username}'s Profile`,
                stylesheet: "/public/css/game-page.css",
                script: "/public/js/game-page.js",
                commentError: "hidden",
                reviewError: "hidden",
                commentError_message: e.error
                //revewError_message?
            });
        
        }

        // Redirect to "GET /:id" to re-render the page.
        return res.redirect(`/games/${req.params.id}`);
        
    })

router
    .route("/:gameId/comment/:commentId")
    .delete(async (req, res) => {
        try{
            const gameId = checkId(req.params.gameId, "DELETE /:gameId/reviews/:reviewId", "Game");
            const commentId = checkId(req.params.commentId, "DELETE /:gameId/reviews/:commentId", "Comment");
            if(!req.session.user || !req.session.user.admin){ //get user, check if logged in
                return res.status(403).render("error", {
                    status: 403,
                    error_message: "Permission Denied. Must be logged in as an admin to delete a review.",
                    stylesheet: "/public/css/error.css",
                    title: "403 Error"
                });
            }

            const result = await comments.removeComment(commentId, "game");

            if (result !== true) {
                return res.status(500).render("error", {
                    status: 500,
                    error_message: "Internal Server Error",
                    title: `500 Error`,
                    stylesheet: "/public/css/error.css"
                });
            }
            return res.redirect(`/games/${gameId}`)
        } catch (error) {
            return res.status(error.status || 500).render("error", {
                status: error.status || 500,
                error_message: error.error,
                stylesheet: "/public/css/error.css",
                title: `${error.status || 500} Error`
            });
        }
    });
export default router;