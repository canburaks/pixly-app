import React from "react";
import { useState, useContext } from "react";
import useForm from "react-hook-form";
import { Mutation } from "react-apollo";
import { PROFILE_MUTATION } from "../functions/mutations";
import UploadAvatar from "./UploadAvatar";
import { FbookAuthButton } from "../functions/facebook";
import { GlobalContext } from "../";
//import { Input } from "../styled-components"
import { Input } from "../styled-components";

import "./UseForms.css";
import "./ProfileInfoForm.css";

export const SignupForm = props => {
	const { register, handleSubmit, errors } = useForm();

	return (
		<form onSubmit={handleSubmit(props.onSubmit)} className="frm-form">
			<input
				className="frm-item"
				ref={register({ required: true, maxLength: 40 })}
				type="text"
				placeholder="Full Name"
				name="Full Name"
			/>
			<input
				className="frm-item"
				ref={register({
					required: true,
					maxLength: 16,
					pattern: /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/i
				})}
				type="text"
				placeholder="Username"
				name="Username"
			/>
			<input
				className="frm-item"
				ref={register({
					required: true,
					minLength: 4,
					maxLength: 40,
					pattern: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
				})}
				type="email"
				placeholder="Email"
				name="Email"
			/>
			<input
				className="frm-item"
				ref={register({
					required: true,
					minLength: 8,
					maxLength: 18,
					pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,18}$/i
				})}
				type="text"
				placeholder="Password"
				name="Password"
			/>
			<input
				className="frm-item"
				ref={register({
					required: true,
					minLength: 8,
					maxLength: 18,
					pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,18}$/i
				})}
				type="text"
				placeholder="Re-Password"
				name="Re-Password"
			/>

			<input className="frm-item" type="submit" />
		</form>
	);
};

export const LoginForm = props => {
	const { register, handleSubmit, errors } = useForm();

	return (
		<form onSubmit={handleSubmit(props.onSubmit)} className="frm-form">
			<input
				className="frm-item"
				type="text"
				placeholder="Username"
				name="Username"
				ref={register({ required: true, maxLength: 16 })}
			/>
			<input
				className="frm-item"
				type="text"
				placeholder="Password"
				name="Password"
				ref={register({ required: true, minLength: 8, maxLength: 18 })}
			/>
			<input className="frm-item" type="submit" />
		</form>
	);
};

export const ProfileInfoForm = props => {
	const state = useContext(GlobalContext);

	return (
		<Mutation
			mutation={PROFILE_MUTATION}
			onCompleted={data => (
				console.log("completed"), state.methods.toggleModal()
			)}
		>
			{mutation => (
				<ProfileForm
					{...props}
					onSubmit={qv => mutation({ variables: { ...qv } })}
				/>
			)}
		</Mutation>
	);
};

const ProfileForm = props => {
	const { register, handleSubmit, errors } = useForm();
	//.log("profile-info-form", props)
	const onSubmit = data => {
		const qv = {};
		qv.name = data["Full Name"];
		qv.bio = data["Bio"];
		qv.country = data["Country"];
		qv.username = props.profile.username;
		//console.log("profile info mutation qv: ", qv)
		props.onSubmit(qv);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="frm-form profile-info-form"
		>
			<div className="fbox-r jcc aic t-bold t-center bor-b-color-dark bor-b-w2">
				Update Profile
			</div>
			<div className="frm-box mar-t-4x">
				<label className="frm-label">Avatar</label>
				<div className="fbox-r jcfs aic w100 mar-b-4x">
					<img src={props.profile.avatar} className="form-avatar" />
					<UploadAvatar refetch={props.refetch} />
				</div>
			</div>

			<div className="frm-box">
				<label className="frm-label">Name</label>
				<Input
					className="frm-item"
					defaultValue={props.profile.name}
					type="text"
					placeholder="Full Name"
					name="Full Name"
					ref={register({ maxLength: 40 })}
				/>
			</div>

			<div className="frm-box">
				<label className="frm-label">Bio</label>
				<Input
					className="frm-item"
					name="Bio"
					type="text"
					ref={register({ maxLength: 140 })}
					defaultValue={props.profile.bio}
				/>
			</div>

			<div className="frm-box">
				<label className="frm-label">Country</label>
				<select
					className="frm-select frm-item"
					name="Country"
					ref={register}
					defaultValue={
						props.profile.country && props.profile.country[1]
					}
				>
					{Object.keys(countries).map(c => (
						<option value={c} key={c}>
							{countries[c]}
						</option>
					))}
				</select>
			</div>
			<Input className="frm-item info-submit" type="submit" />

			<div className="fbox-r jcfs aic w100">
				<FbookAuthButton />
			</div>
		</form>
	);
};

const countries = {
	AF: "Afghanistan",
	AX: "Åland Islands",
	AL: "Albania",
	DZ: "Algeria",
	AS: "American Samoa",
	AD: "Andorra",
	AO: "Angola",
	AI: "Anguilla",
	AQ: "Antarctica",
	AG: "Antigua and Barbuda",
	AR: "Argentina",
	AM: "Armenia",
	AW: "Aruba",
	AU: "Australia",
	AT: "Austria",
	AZ: "Azerbaijan",
	BS: "Bahamas",
	BH: "Bahrain",
	BD: "Bangladesh",
	BB: "Barbados",
	BY: "Belarus",
	BE: "Belgium",
	BZ: "Belize",
	BJ: "Benin",
	BM: "Bermuda",
	BT: "Bhutan",
	BO: "Bolivia",
	BQ: "Bonaire, Sint Eustatius and Saba",
	BA: "Bosnia and Herzegovina",
	BW: "Botswana",
	BV: "Bouvet Island",
	BR: "Brazil",
	IO: "British Indian Ocean Territory",
	BN: "Brunei",
	BG: "Bulgaria",
	BF: "Burkina Faso",
	BI: "Burundi",
	CV: "Cabo Verde",
	KH: "Cambodia",
	CM: "Cameroon",
	CA: "Canada",
	KY: "Cayman Islands",
	CF: "Central African Republic",
	TD: "Chad",
	CL: "Chile",
	CN: "China",
	CX: "Christmas Island",
	CC: "Cocos (Keeling) Islands",
	CO: "Colombia",
	KM: "Comoros",
	CD: "Congo (the Democratic Republic of the)",
	CG: "Congo",
	CK: "Cook Islands",
	CR: "Costa Rica",
	CI: "Côte d'Ivoire",
	HR: "Croatia",
	CU: "Cuba",
	CW: "Curaçao",
	CY: "Cyprus",
	CZ: "Czechia",
	DK: "Denmark",
	DJ: "Djibouti",
	DM: "Dominica",
	DO: "Dominican Republic",
	EC: "Ecuador",
	EG: "Egypt",
	SV: "El Salvador",
	GQ: "Equatorial Guinea",
	ER: "Eritrea",
	EE: "Estonia",
	SZ: "Eswatini",
	ET: "Ethiopia",
	FK: "Falkland Islands  [Malvinas]",
	FO: "Faroe Islands",
	FJ: "Fiji",
	FI: "Finland",
	FR: "France",
	GF: "French Guiana",
	PF: "French Polynesia",
	TF: "French Southern Territories",
	GA: "Gabon",
	GM: "Gambia",
	GE: "Georgia",
	DE: "Germany",
	GH: "Ghana",
	GI: "Gibraltar",
	GR: "Greece",
	GL: "Greenland",
	GD: "Grenada",
	GP: "Guadeloupe",
	GU: "Guam",
	GT: "Guatemala",
	GG: "Guernsey",
	GN: "Guinea",
	GW: "Guinea-Bissau",
	GY: "Guyana",
	HT: "Haiti",
	HM: "Heard Island and McDonald Islands",
	VA: "Holy See",
	HN: "Honduras",
	HK: "Hong Kong",
	HU: "Hungary",
	IS: "Iceland",
	IN: "India",
	ID: "Indonesia",
	IR: "Iran",
	IQ: "Iraq",
	IE: "Ireland",
	IM: "Isle of Man",
	IL: "Israel",
	IT: "Italy",
	JM: "Jamaica",
	JP: "Japan",
	JE: "Jersey",
	JO: "Jordan",
	KZ: "Kazakhstan",
	KE: "Kenya",
	KI: "Kiribati",
	KP: "North Korea",
	KR: "South Korea",
	KW: "Kuwait",
	KG: "Kyrgyzstan",
	LA: "Laos",
	LV: "Latvia",
	LB: "Lebanon",
	LS: "Lesotho",
	LR: "Liberia",
	LY: "Libya",
	LI: "Liechtenstein",
	LT: "Lithuania",
	LU: "Luxembourg",
	MO: "Macao",
	MK: "Macedonia",
	MG: "Madagascar",
	MW: "Malawi",
	MY: "Malaysia",
	MV: "Maldives",
	ML: "Mali",
	MT: "Malta",
	MH: "Marshall Islands",
	MQ: "Martinique",
	MR: "Mauritania",
	MU: "Mauritius",
	YT: "Mayotte",
	MX: "Mexico",
	FM: "Micronesia (Federated States of)",
	MD: "Moldova",
	MC: "Monaco",
	MN: "Mongolia",
	ME: "Montenegro",
	MS: "Montserrat",
	MA: "Morocco",
	MZ: "Mozambique",
	MM: "Myanmar",
	NA: "Namibia",
	NR: "Nauru",
	NP: "Nepal",
	NL: "Netherlands",
	NC: "New Caledonia",
	NZ: "New Zealand",
	NI: "Nicaragua",
	NE: "Niger",
	NG: "Nigeria",
	NU: "Niue",
	NF: "Norfolk Island",
	MP: "Northern Mariana Islands",
	NO: "Norway",
	OM: "Oman",
	PK: "Pakistan",
	PW: "Palau",
	PS: "Palestine, State of",
	PA: "Panama",
	PG: "Papua New Guinea",
	PY: "Paraguay",
	PE: "Peru",
	PH: "Philippines",
	PN: "Pitcairn",
	PL: "Poland",
	PT: "Portugal",
	PR: "Puerto Rico",
	QA: "Qatar",
	RE: "Réunion",
	RO: "Romania",
	RU: "Russia",
	RW: "Rwanda",
	BL: "Saint Barthélemy",
	SH: "Saint Helena, Ascension and Tristan da Cunha",
	KN: "Saint Kitts and Nevis",
	LC: "Saint Lucia",
	MF: "Saint Martin (French part)",
	PM: "Saint Pierre and Miquelon",
	VC: "Saint Vincent and the Grenadines",
	WS: "Samoa",
	SM: "San Marino",
	ST: "Sao Tome and Principe",
	SA: "Saudi Arabia",
	SN: "Senegal",
	RS: "Serbia",
	SC: "Seychelles",
	SL: "Sierra Leone",
	SG: "Singapore",
	SX: "Sint Maarten (Dutch part)",
	SK: "Slovakia",
	SI: "Slovenia",
	SB: "Solomon Islands",
	SO: "Somalia",
	ZA: "South Africa",
	GS: "South Georgia and the South Sandwich Islands",
	SS: "South Sudan",
	ES: "Spain",
	LK: "Sri Lanka",
	SD: "Sudan",
	SR: "Suriname",
	SJ: "Svalbard and Jan Mayen",
	SE: "Sweden",
	CH: "Switzerland",
	SY: "Syria",
	TW: "Taiwan",
	TJ: "Tajikistan",
	TZ: "Tanzania",
	TH: "Thailand",
	TL: "Timor-Leste",
	TG: "Togo",
	TK: "Tokelau",
	TO: "Tonga",
	TT: "Trinidad and Tobago",
	TN: "Tunisia",
	TR: "Turkey",
	TM: "Turkmenistan",
	TC: "Turks and Caicos Islands",
	TV: "Tuvalu",
	UG: "Uganda",
	UA: "Ukraine",
	AE: "United Arab Emirates",
	GB: "United Kingdom",
	UM: "United States Minor Outlying Islands",
	US: "United States of America",
	UY: "Uruguay",
	UZ: "Uzbekistan",
	VU: "Vanuatu",
	VE: "Venezuela",
	VN: "Vietnam",
	VG: "Virgin Islands (British)",
	VI: "Virgin Islands (U.S.)",
	WF: "Wallis and Futuna",
	EH: "Western Sahara",
	YE: "Yemen",
	ZM: "Zambia",
	ZW: "Zimbabwe"
};
