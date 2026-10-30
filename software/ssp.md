## What HEC-SSP is

The **Statistical Software Package (HEC-SSP)** performs **frequency analysis** of hydrologic data — for example, fitting a probability distribution to 30 years of annual peak floods to estimate the 100-year flood. It implements the procedures of **Bulletin 17C** (the US federal guideline for flood-frequency analysis, using the log-Pearson Type III distribution) as well as general frequency analysis with other distributions, and draws frequency curves with confidence limits.

We use it once, in **Session 35**, after computing Gumbel's method by hand, to see how the same data look under a different distribution and how wide the uncertainty is for long return periods.

## The key ideas it automates

- **Annual maximum series** — one value per year (Session 8).
- **Plotting positions** — the empirical exceedance probability of each observation (Weibull in Session 8).
- **Fitting a distribution** — Gumbel (extreme value type I) by hand in Session 35; log-Pearson III in HEC-SSP.
- **Confidence limits** — how uncertain the estimated 100-year value is with only 30 years of data.

::widget[risk]

## Learn more

- HEC-SSP **User's Manual** (HEC website).
- England, J.F. et al. (2019). *Guidelines for determining flood flow frequency — Bulletin 17C*. US Geological Survey Techniques and Methods 4-B5 (see [References](#/page/references)).
