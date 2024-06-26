# Forecast Scoring Function
This document describes the deriving process of the forecast scoring function in [Forecast Score Calculation Method](./system-explained.md).

Based on *Assumption 1*, that the forecast score is a linear function of the difference between the forecasted value and the true value, the forecast score function $S_e$ has the following form where $a$, $b$ are constants.

$$ \begin{equation}
S_e (X_e, \hat{X}_e) = a + b | X_e - \hat{X}_e |
\end{equation} $$

We can set the constants $a$, $b$ so that the above forecast score function can satisfy *Assumption 3*. The mathematical statement of *Assumption 3* is as follows:

$$ \begin{equation}
\begin{cases}
    S_e (X_e, \hat{X}_e) = 100
    \\
    \mathbb{E}[S_e (X_e, \mu_e)] = 0
\end{cases}
\end{equation}$$

Expanding the first equation of (2):

$$ \begin{equation}
100 = S_e (X_e, \hat{X}_e) = a + b | X_e - X_e | = a
\end{equation} $$

Thus,

$$ \begin{equation}
a = 100
\end{equation} $$

Expanding the second equation of (2):

$$ \begin{equation}
    \begin{aligned}
        0 = \mathbb{E}[S_e (X_e, \mu_e)]
        & = a + b \mathbb{E}[|X_e - \mu_e|]
        \\ & = a + b \sigma_e \mathbb{E} \left[
            \left|
                \frac{X_e - \mu_e}{\sigma_e}
            \right|
        \right]
        \\ & = a + b \sigma_e \mathbb{E}[| Z |]
    \end{aligned}
\end{equation} $$

Note that $Z$ follows the standard normal distribution, in other words, $Z \sim N(0, 1)$. The distribution $|Z|$ is a kind of the half-normal distribution, which has a following property:

$$ \begin{equation}
    X \sim N(0, \sigma)
    \rightarrow 
    \mathbb{E}[|X|] = \frac{\sqrt{2}}{\sqrt{\pi}} \sigma
\end{equation} $$

By applying the property above to equation (5):

$$ \begin{equation}
    \begin{aligned}
        0 & = a + b \sigma_e \mathbb{E}[| Z |]
        \\ & = a + b \sigma_e \left(
            \frac{\sqrt{2}}{\sqrt{\pi}} \cdot 1
        \right)
        \\ & = 100 + \frac{\sqrt{2}\sigma_e}{\sqrt{\pi}} b
    \end{aligned}
\end{equation} $$

Thus,

$$ \begin{equation}
    b = -100 \frac{\sqrt{\pi}}{\sqrt{2}} \frac{1}{\sigma_e}
\end{equation} $$

By assigning $a$ and $b$ into the equation (1):

$$ \begin{equation}
S_e(X_e, \hat{X}_e) =
100(
    1 - \frac{
        \sqrt{\pi}
    }{
        \sqrt{2} \sigma_e
    } |X_e - \hat{X}_e|
)
\end{equation} $$
