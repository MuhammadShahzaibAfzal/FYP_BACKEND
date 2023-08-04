class EmailService{
    async sendPasswordResetEmail(email,token){
        console.log(`Hi ${email}, please click on that link in order to reset password http://localhost/3000/password-reset/${token}`);
    }
}

module.exports = new EmailService();