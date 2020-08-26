# Delta

FAM Delta allows users to compare two Frame Agreements and inspect the differences between them. Delta will compare both FA fields and their attachments.

With “Delta” button configured in standard buttons, we can now look at the simple example of its use case.

1. Take our Frame Agreement “Delta Test #1“ as a perfect candidate. It has several FA fields and two products to its name.

![]({{images}}/Delta1.png)

2. We added a discount to the “Mobile L“ product.

![]({{images}}/Delta2.png)

![]({{images}}/Delta3.png)

3. Let's save this FA and clone it. On the cloned FA, we reverse all the negotiations, remove one product, add a new product and change some fields.

![]({{images}}/Delta4.png)

4. Let's enter the Delta modal by clicking “Compare Agreements“

![]({{images}}/Delta5.png)

On the left side, we can inspect the current FA using the JSON viewer-like component. On the right, we need to select the FA for comparison. Note that if the FA has a newer version, this dropdown will automatically select it.

5. Let's choose our original FA “Delta Test #1“ and hit “Calculate Delta”, which became available.

![]({{images}}/Delta6.png)

6. The difference structure will now be presented. Looking at “Frame Agreement Fields“ (left), it is clearly visible our differences have been properly detected.

![]({{images}}/Delta7.png)

7. On the right side, we can see the difference between attachments. Before expanding the “Mobile L“, we can see that adding and removing of products has been recorded.

![]({{images}}/Delta8.png)

Negotiation done in the original is properly reflected.