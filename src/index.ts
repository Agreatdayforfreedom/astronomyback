import app from './app'

const server = app.listen(app.get('port'), () => {
    console.log('listening on port ' + app.get('port'));
});

export default server;