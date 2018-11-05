const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs')

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 
const PORT = 8080;
app.listen(PORT);

// Pogranie i odczytanie JSON'a z pliku.
const registeredUsers = JSON.parse( fs.readFileSync('text.txt').toString() );

app.post('/register', (req, res) => {
  // Odczytanie wartości z formularza otrzymanego.
  const { login, password, repeatedPassword } = req.body;
  // Sprawdzenie czy otrzymany login nie znajduje się już w naszej bazie.
  const thisLogin = registeredUsers.find((el) => el.userLogin === login)
  
  if (login !== '' && !thisLogin) {
    if (password == repeatedPassword && password !== '' && repeatedPassword !== '') {
      // Zarejestrowanie użytkownika, wprowadzenie go do bazy.
      res.send('Wow! Zarejestrowałeś się!');
      const user = {userLogin: login, userPassword: password}
      registeredUsers.push(user)  
      fs.writeFileSync('text.txt', JSON.stringify(registeredUsers));
    } else {
      // Błędne hasła.
      res.send('Poknociłeś coś w hasłach, spróbuj ponownie!')
    }
  } else if (thisLogin) {
    // Podany użytkownik już istnieje.
    res.send('Taka nazwa użytkownika już istnieje!');
  } else if( login == '') {
    // Brak nazwy użytkownika.
    res.send('Nie wpisałeś nazwy użytkownika, spróbuj jeszcze raz!');
  } 
  
});

app.post('/login', (req, res) => {
  // Odczytanie wartości z formularza otrzymanego.
  const { login, password } = req.body;
  // Sprawdzenie czy otrzymany login znajduje się już w naszej bazie.
  const thisUser = registeredUsers.find(el => el.userLogin === login)
  if (thisUser !== undefined) {
      if (thisUser.userPassword === password){
        // Zalogowanie użytkownika gdy poda prawidłowy login i hasło.
        res.send('Zalogowałeś się, gratulacje!')
      } else {
        // Błędne hasło.
        res.send('Pomyliłeś hasło, kolego!')
      }
  } else {
    // Błędny login i hasło.
    res.send('Nie udało Ci się zalogować, zrób wpierw konto!')
  };
  
});