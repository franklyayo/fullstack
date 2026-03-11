
{ pkgs, ... }: {
  # Use the stable channel for nix packages. This determines which package
  # versions are available.
  channel = "stable-24.05";

  # Add the packages you want to have in your environment.
  packages = [
    pkgs.nodejs_20
    pkgs.foreman
  ];

  # Configure your workspace.
  idx = {
    # Add VS Code extensions from the Open VSX Registry.
    extensions = [
      "dbaeumer.vscode-eslint"
    ];

    # Workspace lifecycle hooks.
    workspace = {
      # These commands run when a workspace is first created.
      onCreate = {
        # Install dependencies for the root and client.
        npm-install-root = "npm install";
        npm-install-client = "npm install --prefix client";
      };
    };

    # Configure web previews for your application.
    previews = {
      enable = true;
      previews = {
        web = {
          # This command starts both the backend and frontend.
          command = ["foreman" "start" "-f" "Procfile"];
          manager = "web";
        };
      };
    };
  };
}
