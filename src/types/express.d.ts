declare global {
    interface UserToken {
        id: string;
        role: string;
    }

    namespace Express {
        interface Request {
            user?: UserToken;
        }
    }
}

export { };
