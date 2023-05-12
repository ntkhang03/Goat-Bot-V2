{ pkgs }: {
	deps = [
		pkgs.nodejs-16_x
		pkgs.nodePackages.typescript-language-server
		pkgs.libuuid
		pkgs.replitPackages.jest
	];
	env = {
		LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [pkgs.libuuid];
	};
}