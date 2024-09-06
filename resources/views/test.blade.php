<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>

<body>
    <h2>Hi</h2>
    <p><h3>Cc: </h3>
        <ul>
            @foreach ($cc as $cc_em)
                <li>{{ $cc_em }}</li>
            @endforeach
        </ul></p>
    <p><h3>Bcc: </h3>
        <ul>
            @foreach ($bcc as $email)
                <li>{{ $email }}</li>
            @endforeach
        </ul></p>
    <p>{{ $value}}</p> 
    <p></p>
    <h4>Regards</h4>
    <h5>Oish</h5>
</body>

</html>