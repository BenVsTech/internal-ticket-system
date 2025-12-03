// Exporting Types

export interface Section {
    settings: boolean;
    tickets: boolean;
    teams: boolean;
    admin: boolean;
}

export interface SettingsProps {
    setup: {
        onClose: () => void;
    }
}