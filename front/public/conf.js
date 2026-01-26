window.config = {
	endpoints: {
		core: "https://localhost:3000",
	},
	oidc: {
		authority: "https://auth.elyspio.fr/realms/apps",
		client_id: "test-coexya-sous-marin-jaune",
		redirect_uri: `${window.location.origin}/auth/callback`,
		scope: "openid profile",
		post_logout_redirect_uri: `${window.location.origin}/auth/logout`,
		silent_redirect_uri: `${window.location.origin}/auth/callback`,
		response_type: "code",
		disablePKCE: false,
		extraQueryParams: {
			kc_idp_hint: "google",
		},
	},
};
