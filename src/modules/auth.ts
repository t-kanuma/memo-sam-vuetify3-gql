import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
  type IAuthenticationDetailsData,
  CognitoUserSession,
  type ICognitoUserData,
  // CookieStorage,
} from "amazon-cognito-identity-js";

/**
 * Runtime Error
 */
class NoUserSessionError extends Error {
  constructor(message = "No user session") {
    super(message);
  }
}

// const cookieSetting = {
//   domain: "localhost",
//   expires: 30,
//   secure: true,
//   sameSite: "strict",
// };

/**
 *
 */
const userPool = new CognitoUserPool({
  UserPoolId: `${import.meta.env.VITE_COGNITO_USER_POOL_ID}`,
  ClientId: `${import.meta.env.VITE_COGNITO_CLIENT_ID}`,
  // Storage: new CookieStorage(cookieSetting),
});

let cognitoUser: CognitoUser | null = null;
/**
 *
 * @param {*} userName
 * @param {*} password
 * @returns
 */
export const authenticate = async (
  userName: string,
  password: string
): Promise<CognitoUserSession> => {
  if (!userName || !password) {
    throw new Error("loginId or password is empty");
  }

  const user: ICognitoUserData = {
    Username: userName,
    Pool: userPool,
    // Storage: new CookieStorage(cookieSetting),
  };
  cognitoUser = new CognitoUser(user);

  const authenticationData: IAuthenticationDetailsData = {
    Username: userName,
    Password: password,
  };
  const authenticationDetails = new AuthenticationDetails(authenticationData);

  return new Promise((resolve, reject): void => {
    // この中で勝手にid/access/refreshをlocalStorageに保管してくれる。
    // TODO Cookieに入れること。
    cognitoUser?.authenticateUser(authenticationDetails, {
      onSuccess: resolve,
      onFailure: reject,
      newPasswordRequired: resolve,
    });
  });
};

// TODO これはいずれ消される。
/**
 *
 * @param {*} userName
 * @param {*} newPassword
 * @returns
 */
export const completeNewPasswordChallenge = async (
  userName: string,
  newPassword: string
): Promise<unknown> => {
  if (!userName || !newPassword) {
    throw new Error("loginId or NewPassword is empty");
  }

  return new Promise((resolve, reject): void => {
    cognitoUser?.completeNewPasswordChallenge(newPassword, null, {
      onSuccess: resolve,
      onFailure: reject,
    });
  });
};

/**
 *
 * @returns
 */
export const getUserSession = (): Promise<CognitoUserSession> | null => {
  const cognitoUser = userPool.getCurrentUser();
  if (!cognitoUser) {
    // 未ログイン状態
    return null;
  }

  return new Promise((resolve, reject) => {
    // idTokenが期限切れの場合、refreshTokenを使って自動的に更新してくれる。
    cognitoUser.getSession(
      (err: Error | null, session: CognitoUserSession): void => {
        if (err) {
          // refreshTokenが期限切れの場合
          reject(err);
        }

        resolve(session);
      }
    );
  });
};

/**
 *
 */
export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const userSession = await getUserSession();
    if (!userSession) {
      // 未ログイン状態
      return false;
    }

    // ログイン状態
    return userSession.isValid();
  } catch {
    // リフレッシュトークンが期限切れの場合
    return false;
  }
};

/**
 * UserSessionがある状態を前提としている。
 * @returns
 */
export const getIdToken = async (): Promise<string> => {
  try {
    const userSession = await getUserSession();
    if (!userSession) {
      throw new NoUserSessionError();
    } else {
      return userSession.getIdToken().getJwtToken();
    }
  } catch {
    throw new NoUserSessionError();
  }
};

/**
 *
 * UserSessionがある状態を前提としている。
 */
export const getUsername = async (): Promise<string> => {
  const cognitoUser = userPool.getCurrentUser();
  if (!cognitoUser) {
    throw new NoUserSessionError();
  }

  return cognitoUser.getUsername();
};

/**
 *
 * @returns
 */
export const logout = async (): Promise<void> => {
  const cognitoUser = userPool.getCurrentUser();

  return new Promise((resolve): void => {
    cognitoUser?.signOut(resolve);
  });
};
