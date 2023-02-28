module.exports = (name) => {
	return `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
      
          <style>
              .container{
                  padding: 12px 10px;
                  background-color: aliceblue;
              }
              .header{
                  color: darkblue;
                  font-weight: 300;
                  font-style: oblique;
                  text-align: center;
              }
      
          </style>
      </head>
      
      <body>
          <div class="container">
              <h1 class="header">You are welcome ! ${name}</h1>
              <p class="paragraph">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt temporibus laborum hic reprehenderit cumque!
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt temporibus laborum hic reprehenderit cumque!
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt temporibus laborum hic reprehenderit cumque!
              </p>
              <img src="http://localhost:8081/images/bg_mail.jpg"  widtth="200" height="300"/>
          </div>
      </body>
      </html>`;
};
