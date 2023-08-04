class TransactionController{
    async reservedBook(req,res,next){
        // only authenticated user
        // only available book reseverd..
        // only two/three books reseved 
    }

    async issuedBook(req,res,next){
        // only librarian issued books
        // check student history (already issued book )
        // chedk books (Avaialbe--->Issued , Reserved ----> Issued , Not Reserved ---> Not Issued)
        // book status change ---reserved or avaialbe ---> issued
    }

    async returnedBook(req,res,next){
        // search student.....
        // issued books shows
        // Return ---> 
        // book status --- issued ---> avaialble
    }

    // CRON JOBS
    // Every day on 6pm
    // 1. Resevered book day > 3 ---> unserverd book
    // 2. Due data ---> one day before send notification 

}

module.exports = new TransactionController();