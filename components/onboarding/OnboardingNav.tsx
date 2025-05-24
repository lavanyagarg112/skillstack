import LogoutButton from "../auth/logout/LogoutButton";

export default function OnboardingNav() {
  return (
    <header className="bg-purple-100 p-4 shadow-sm">
      <div className="container mx-auto flex justify-start items-center">
        <div className="max-w-max">
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
