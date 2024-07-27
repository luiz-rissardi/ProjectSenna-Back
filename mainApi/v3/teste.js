import autocannon from "autocannon";

const url = 'http://localhost:3000/user/5d6432e3-3902-44d1-ae89-ee289e2189aa';

const body = JSON.stringify({
    userName: "Emilio Rodolfo",
    userDescription: "sou programador sou eu",
    email: "emilioRufolfoFey234@gmail.com",
    photo: null,
    languages: "pt-br",
    password: "123456",
    isActive: true,
    lastOnline: null
});

const options = {
    url,
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json'
    },
    body,
    connections: 2000, // Número de usuários simultâneos
    duration: 20
};

function runAutocannon() {
    autocannon(options, (err, result) => {
        if (err) {
            console.error('Erro ao executar o autocannon:', err);
        } else {
            console.log('Resultado do teste:', result);
        }
    });
}

runAutocannon();
