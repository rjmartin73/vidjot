if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb://rjmartin73:K3rmitFr0g@ds133659.mlab.com:33659/vidjot-prod'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}