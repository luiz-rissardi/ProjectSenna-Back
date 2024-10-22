

export function setHeaders(request, reply, payload) {
    try {
        const data = JSON.parse(payload).result;
        if (data.isSuccess == true) {
            const { email, userId, userName } = data.getData();
            const token = app.jwt.sign({ email, userId, userName }, { expiresIn: '1h' })
            console.log(token);
            reply
                .header('token__auth', token)
        }
    } catch (error) {
        reply.send(error);
    }
}