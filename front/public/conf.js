window.config = {
	endpoints: {
		core: "https://localhost:3000",
	},
	oidc: {
		authority: "https://localhost:8089/realms/apps",
		client_id: "sous-marin-jaune",
		redirect_uri: `${window.location.origin}/auth/callback`,
		scope: "openid profile",
		post_logout_redirect_uri: `${window.location.origin}/auth/logout`,
		silent_redirect_uri: `${window.location.origin}/auth/callback`,
		response_type: "code",
		disablePKCE: false,
	},
};
