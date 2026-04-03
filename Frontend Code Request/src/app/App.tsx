import { FeatureSection } from './components/FeatureSection';
import {
  LoginScreen,
  ForgotPassScreen,
  SignupScreen,
  PrivacyScreen,
  DealSearchScreen,
  LocationDealsScreen,
  QRCodeScreen,
  FavoritesScreen,
  SavingsTrackerScreen,
  ProfileScreen,
  SuccessScreen,
} from './components/ScreenContents';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-700 p-12 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Login Section */}
        <FeatureSection
          title="Login"
          screens={[
            { content: <LoginScreen /> },
            { content: <LoginScreen /> },
            { content: <LoginScreen /> },
          ]}
        />

        {/* Forgot Pass Section */}
        <FeatureSection
          title="Forget Pass"
          screens={[
            { content: <ForgotPassScreen /> },
            { content: <ForgotPassScreen /> },
            { content: <ForgotPassScreen /> },
            { content: <ForgotPassScreen /> },
            { content: <ForgotPassScreen /> },
            { content: <ForgotPassScreen /> },
            { content: <SuccessScreen /> },
            { content: <ForgotPassScreen /> },
          ]}
        />

        {/* Signup Section */}
        <FeatureSection
          title="Signup"
          screens={[
            { content: <SignupScreen /> },
            { content: <SignupScreen /> },
            { content: <SignupScreen /> },
            { content: <SignupScreen /> },
            { content: <SuccessScreen /> },
            { content: <SignupScreen /> },
          ]}
        />

        {/* Privacy Section */}
        <FeatureSection
          title="Privacy"
          screens={[
            { content: <PrivacyScreen /> },
            { content: <PrivacyScreen /> },
            { content: <PrivacyScreen /> },
          ]}
        />

        {/* Feature 1: Deal Search */}
        <FeatureSection
          title="Feature 1: Deal Search"
          screens={[
            { content: <DealSearchScreen /> },
            { content: <LocationDealsScreen /> },
            { content: <LocationDealsScreen /> },
            { content: <DealSearchScreen /> },
            { content: <DealSearchScreen /> },
            { content: <QRCodeScreen /> },
            { content: <SuccessScreen /> },
          ]}
        />

        {/* Feature 2: Location-Deals */}
        <FeatureSection
          title="Feature 2: Location-Deals"
          screens={[
            { content: <LocationDealsScreen /> },
            { content: <LocationDealsScreen /> },
            { content: <LocationDealsScreen /> },
            { content: <QRCodeScreen /> },
            { content: <SuccessScreen /> },
            { content: <LocationDealsScreen /> },
            { content: <LocationDealsScreen /> },
          ]}
        />

        {/* Feature 3: Save Favorites */}
        <FeatureSection
          title="Feature 3: Save Favorites"
          screens={[
            { content: <FavoritesScreen /> },
            { content: <FavoritesScreen /> },
            { content: <FavoritesScreen /> },
          ]}
        />

        {/* Feature 4: Savings Tracker */}
        <FeatureSection
          title="Feature 4: Savings Tracker"
          screens={[
            { content: <SavingsTrackerScreen /> },
          ]}
        />

        {/* Profile Section */}
        <FeatureSection
          title="Profile"
          screens={[
            { content: <ProfileScreen /> },
            { content: <ProfileScreen /> },
            { content: <ProfileScreen /> },
            { content: <ProfileScreen /> },
            { content: <ProfileScreen /> },
            { content: <ProfileScreen /> },
            { content: <ProfileScreen /> },
          ]}
        />
      </div>
    </div>
  );
}
