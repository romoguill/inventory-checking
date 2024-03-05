import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ProviderButton from '../_components/ProviderButton';
import { PROVIDERS } from '@/schemas/auth.schemas';

function RegisterPage() {
  return (
    <Card>
      <CardHeader>Create Account</CardHeader>
      <CardContent>
        <form>
          <ProviderButton provider={PROVIDERS.GOOGLE} />
        </form>
      </CardContent>
    </Card>
  );
}

export default RegisterPage;
