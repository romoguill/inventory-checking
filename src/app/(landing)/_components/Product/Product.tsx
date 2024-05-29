import Title from '../Title';

function Product() {
  return (
    <section className='w-full'>
      <Title>Product</Title>
      <h3 className='text-lg sm:text-xl font-semibold text-landing-foreground my-3'>
        The Problem with Traditional Inventory Management
      </h3>
      <p className='my-3'>
        Whether your company does inventory checking with pen and paper,
        spreadsheets, or a combination of both, you surely have stumbled upon
        some of these problems:
      </p>
      <ul className='space-y-2'>
        <li>
          <span className='font-semibold italic'>Inconsistency: </span>Pages
          with illegible numbers and random annotations.
        </li>
        <li>
          <span className='font-semibold italic'>Time-Consuming: </span>
          Manual assignment to each team member the products to check, following
          up with progress and the favorite part, the reconciliation.
        </li>
        <li>
          <span className='font-semibold italic'>Realtime-Feedback: </span>
          No way to know what the results look like until the end of the round.
        </li>
        <li>
          <span className='font-semibold italic'>Reliable history: </span>
          Since when are we having negative reconciliation of certain item? Did
          we verified the round we did 4 months ago? Who counted what? Where are
          the missing records?
        </li>
      </ul>

      <h3 className='text-lg sm:text-xl font-semibold text-landing-foreground my-3'>
        Check-Delta to the rescue
      </h3>
    </section>
  );
}

export default Product;
