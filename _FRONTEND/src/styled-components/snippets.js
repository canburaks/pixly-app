






// <AutoLink text={"pixly.app"} />
function AutoLink({ text }) {
    const delimiter = /((?:https?:\/\/)?(?:(?:[a-z0-9]?(?:[a-z0-9\-]{1,61}[a-z0-9])?\.[^\.|\s])+[a-z\.]*[a-z]+|(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3})(?::\d{1,5})*[a-z0-9.,_\/~#&=;%+?\-\\(\\)]*)/gi;
  
    return (
      <React.Fragment>
        {text.split(delimiter).map(word => {
          let match = word.match(delimiter);
          if (match) {
            let url = match[0];
            return <a href={url.startsWith('http') ? url : `http://${url}`}>{url}</a>;
          }
          return word;
        })}
      </React.Fragment>
    );
  }


// <Mailto email="canburak@msn.com" subject={"pixly"} body={"avbhg"}>mail</Mailto>
function Mailto({ email, subject, body, ...props }) {
	return (
		<a
			href={`mailto:${email}?subject=${encodeURIComponent(subject) ||
				""}&body=${encodeURIComponent(body) || ""}`}
		>
			{props.children}
		</a>
	);
}



function UncontrolledInput({
	callback,
	type = "text",
	disabled = false,
	readOnly = false,
	placeholder = ""
}) {
	return (
		<input
			type={type}
			disabled={disabled}
			readOnly={readOnly}
			placeholder={placeholder}
			onChange={({ target: { value } }) => callback(value)}
		/>
	);
}
