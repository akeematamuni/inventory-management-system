// PRE-REQUEST
// Access token has expired, refresh it using the refresh token
// Ensure "refreshTokenUrl" is set as part env in postman
const accessTokenExpiry = pm.environment.get("exp");
const refreshToken = pm.environment.get("refreshToken");
const currentTime = Math.floor(Date.now() / 1000);

if (currentTime >= accessTokenExpiry) {
    pm.sendRequest(
        {
            url: pm.environment.get("refreshTokenUrl"),
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            body: {
                mode: 'raw',
                raw: JSON.stringify({ refreshToken })
            }
        },
        (err, res) => {
            if (res && res.code === 201) {
                const jsonData = res.json();
                const token = jsonData.accessToken.split('.')[1];
                const decodedToken = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));

                // Store available data in environment variables
                pm.environment.set("exp", decodedToken.exp);
                pm.environment.set("email", decodedToken.email);
                pm.environment.set("userId", decodedToken.userId);
                pm.environment.set("accessToken", jsonData.accessToken);
                pm.environment.set("refreshToken", jsonData.refreshToken);
                
            } else {
                console.error("Failed to refresh token", err);
            }
        }
    );

} else {
    console.log("Access token is still valid...");
}


// POST-RESPONSE
const jsonData = pm.response.json();

if (jsonData) {
    try {
        const token = jsonData.accessToken.split('.')[1];
        const decodedToken = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));

        // Store available data in environment variables
        pm.environment.set("exp", decodedToken.exp);
        pm.environment.set("email", decodedToken.email);
        pm.environment.set("userId", decodedToken.userId);
        pm.environment.set("accessToken", jsonData.accessToken);
        pm.environment.set("refreshToken", jsonData.refreshToken);
        
    } catch(error) {
        console.error(`There was an error\n${error}`);
    }
}
